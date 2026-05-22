---
title: register-lisp vm design
author: opencode/deepseek-v4-pro
date: 2026-05-22
---

# 目标

在 stack-lisp.c 的 value encoding 与 GC 基础上，
设计全新的 register VM，采用 3-address 格式。

# Frame 设计

## 决策：连续 frame 栈

每个 frame 不再是堆上独立的 `frame_t`，而是存储在一个大的连续 buffer 中：

```
┌────────────────────────────────────────────────┐
│  frame buffer（连续内存，可动态增长）             │
│                                                │
│  header  regs          header  regs            │
│ ┌──────┬─────────┐   ┌──────┬─────────┐        │
│ │ caller│ r0 ... │   │callee │ r0 ... │   ...  │
│ └──────┴─────────┘   └──────┴─────────┘        │
│  ← 低地址                  ← sp 当前帧          │
└────────────────────────────────────────────────┘
```

### frame header

```c
struct frame_t {
  uint8_t *return_ip;      // caller 的下一条指令地址
  uint8_t  return_rd;      // caller 的哪个 rd 接收返回值
  uint32_t max_registers;  // 本 frame 的寄存器数量
};
```

header 之后紧跟着就是 `value_t[max_registers]` 的 register 数组。
所有寄存器访问通过 `sp + offset` 计算，不需要指针间接。

### call

```
OP_CALL rd, symbol, r_arg0, ..., r_argN
```

1. 计算新 frame 大小 = `sizeof(frame_t) + max_registers * sizeof(value_t)`
2. 在 frame buffer 末尾 bump-allocate 新 frame
3. 写入 header：`return_ip = 下一条指令`, `return_rd = rd`
4. 写入 registers：`r0..r_argN` 拷贝自 caller 的 r_arg0..r_argN；剩余寄存器清零
5. sp 移动到新 frame

### ret

```
OP_RET rs
```

1. 从当前 frame header 读取 `return_ip` 和 `return_rd`
2. 将当前 frame 的 `registers[rs]` 拷贝到 caller frame 的 `registers[return_rd]`
3. sp 移回 caller frame
4. ip = return_ip

### tail call

```
OP_TAILCALL symbol, r_arg0, ..., r_argN
```

1. 因为所有返回值都走 r0（约定），不需要 treat rd
2. 直接在**当前 frame 的位置**创建新 frame：如果 callee 的 max_registers 和 arity 小于等于当前 frame，直接覆盖寄存器区域；否则 resize frame buffer
3. 写入 regs：`r0..r_argN` 拷贝自 caller 的 r_arg0..r_argN
4. ip 跳转到 callee 入口
5. 当 callee OP_RET 时，`return_ip` 和 `return_rd` 仍然是**原来 caller 的 caller** 的
   （因为 TAILCALL 没有覆盖 header）

关键：TAILCALL 不修改 `return_ip` 和 `return_rd`，所以 callee 的 RET 直接返回到调用链上上一层。

### GC root scanning

从 frame buffer 底扫描到 sp：

```
for (ptr = frame_buffer_base; ptr < sp; ) {
  frame_t *header = (frame_t *)ptr;
  value_t *regs = (value_t *)(ptr + sizeof(frame_t));
  for (i = 0; i < header->max_registers; i++)
    if (object_p(regs[i]))
      array_push(roots, to_object(regs[i]));
  ptr += sizeof(frame_t) + header->max_registers * sizeof(value_t);
}
```

结构和连续栈天然支持 GC 遍历。

## 与 x86 + C calling convention 的对比

不是「所有参数用栈传递」。连续 frame buffer 看起来像 C stack，但不同的在于：
- 每个 frame 有**自己的一组虚拟寄存器**（像 SPARC 的 register window）
- 参数通过 caller 把值拷贝进 callee 的 r0..rN，而非在 caller 的栈区域放参数
- 没有 caller-saved/callee-saved 协调

更准确的类比是 **SPARC 的 register window**：call 时 callee 拿到一组新的寄存器，
其中前 N 个被预先填入参数值；只有 overflow 才需要写回 caller 的 frame。
register-lisp 更进一步——因为虚拟寄存器不受物理数量限制，
永远不需要 spill 到 caller frame。

# 指令集

## op_t

```c
typedef enum {
  OP_LOADLIT,       // rd = literal_value
  OP_MOV,           // rd = rs
  OP_LOADGLOBAL,    // rd = global(symbol)
  OP_STOREGLOBAL,   // global(symbol) = rs
  OP_JUMP,          // ip += offset
  OP_JUMPIF,        // if rs != x_false then ip += offset
  OP_JUMPIFNOT,     // if rs == x_false then ip += offset
  OP_CALL,          // rd = symbol(r_arg0, ..., r_argN)
  OP_TAILCALL,      // tail call symbol(r_arg0, ..., r_argN)
  OP_APPLY,         // rd = apply(func_reg, r_arg0, ..., r_argN)
  OP_TAILAPPLY,     // tail apply func_reg(r_arg0, ..., r_argN)
  OP_REF,           // rd = x_object(definition)
  OP_RET,           // return rs
} op_t;
```

## instr_t

```c
struct instr_t {
  op_t op;
  union {
    struct { uint8_t rd; value_t value; } loadlit;

    struct { uint8_t rd; uint8_t rs; } mov;

    struct { uint8_t rd; uint32_t symbol; } loadglobal;
    struct { uint8_t rs; uint32_t symbol; } storeglobal;

    struct { int32_t offset; } jump;
    struct { uint8_t rs; int32_t offset; } jumpif;
    struct { uint8_t rs; int32_t offset; } jumpifnot;

    struct {
      uint8_t rd;
      uint32_t symbol;
      uint8_t argc;
      uint8_t args[];     // argc 个 uint8_t 寄存器索引
    } call;

    struct {
      uint32_t symbol;
      uint8_t argc;
      uint8_t args[];
    } tailcall;

    struct {
      uint8_t rd;
      uint8_t func;
      uint8_t argc;
      uint8_t args[];
    } apply;

    struct {
      uint8_t func;
      uint8_t argc;
      uint8_t args[];
    } tailapply;

    struct { uint8_t rd; uint32_t symbol; } ref;

    struct { uint8_t rs; } ret;
  };
};
```

# 字节码编码

```
指令            字节数
────────────────────────────────────────
OP_LOADLIT      1 + 1 + 8 = 10       opcode(1B) rd(1B) value(8B)
OP_MOV          1 + 1 + 1 = 3        opcode(1B) rd(1B) rs(1B)
OP_LOADGLOBAL   1 + 1 + 4 = 6        opcode(1B) rd(1B) symbol(4B)
OP_STOREGLOBAL  1 + 1 + 4 = 6        opcode(1B) rs(1B) symbol(4B)
OP_JUMP         1 + 4 = 5            opcode(1B) offset(4B)
OP_JUMPIF       1 + 1 + 4 = 6        opcode(1B) rs(1B) offset(4B)
OP_JUMPIFNOT    1 + 1 + 4 = 6        opcode(1B) rs(1B) offset(4B)
OP_CALL         1 + 1 + 4 + 1 + N    opcode(1B) rd(1B) symbol(4B) argc(1B) args[N]
OP_TAILCALL     1 + 4 + 1 + N        opcode(1B) symbol(4B) argc(1B) args[N]
OP_APPLY        1 + 1 + 1 + 1 + N    opcode(1B) rd(1B) func(1B) argc(1B) args[N]
OP_TAILAPPLY    1 + 1 + 1 + N        opcode(1B) func(1B) argc(1B) args[N]
OP_REF          1 + 1 + 4 = 6        opcode(1B) rd(1B) symbol(4B)
OP_RET          1 + 1 = 2            opcode(1B) rs(1B)
```

## symbol 字段的 resolution

序列化时 `symbol` 写入 `uint32_t` index，对应 module 的 symbol table。
加载时分两阶段：先注册所有 definition 名字，再遍历每条指令把 symbol_index
resolve 为 `definition_t *`。

# S-expression 语法

register-lisp 的 sexp 语法是 stack-lisp 语法的延续，
每条指令对应一个 list form，指令名在前，操作数按顺序后随。

## 顶层定义

```
; function: 名字 + arity + body
(define-function <name> <arity> <instr>...)

; variable: 名字 + initializer body（返回值的 body 末尾值即为变量值）
(define-variable <name> <instr>...)

; test: 名字 + body（类似 arity=0 的 function）
(define-test <name> <instr>...)
```

`max_registers` 由 assembler 在扫描 body 时自动计算——取所有被使用的寄存器 index 的最大值 + 1。

## 指令一览

指令中的寄存器操作数用整数表示（`0` = r0, `1` = r1 ...）。
label 用独立的裸符号表示，写法同 stack-lisp。

```
(load-lit      <rd> <value>)
(mov           <rd> <rs>)
(load-global   <rd> <name>)
(store-global  <rs> <name>)
(ref           <rd> <name>)
(call          <rd> <name> <arg-reg>...)
(tail-call     <name> <arg-reg>...)
(apply         <rd> <func-reg> <arg-reg>...)
(tail-apply    <func-reg> <arg-reg>...)
(ret           <rs>)
(ret)                           ;; 返回 void（对 arity=0 的 test）
(jump          <label>)
(jump-if       <rs> <label>)
(jump-if-not   <rs> <label>)
```

### 与 stack-lisp 的关键差异

- `(load-lit 0 1)` 替代了 `(local-load 0 _) + (literal 1) + ...` 的 push/pop 组合
- `(call 2 builtin/isub 0 1)` 直接把参数寄存器写在指令内，不需要先把参数推到 value stack 再 call
- `(ret 0)` 替代 `(return)`——明确指定返回哪个寄存器
- 不再有 `OP_DROP`，因为没有需要抛弃的栈顶值

## value 的类型字面量

`<value>` 支持与 stack-lisp 相同的字面量体系：

```
(load-lit 0 42)           ; int -> x_int(42)
(load-lit 0 3.14)         ; float -> x_float(3.14)
(load-lit 0 #t)           ; true -> x_true
(load-lit 0 #f)           ; false -> x_false
(load-lit 0 :void)        ; void -> x_void
(load-lit 0 "hello")      ; string -> interned xstring
(load-lit 0 symbol)       ; symbol -> interned symbol
(load-lit 0 :keyword)     ; keyword -> interned keyword
```

## 完整示例

### 阶乘

```lisp
(define-function factorial 1
  (load-lit 1 1)
  (call 2 builtin/int-less-or-equal? 0 1)
  (jump-if-not 2 else)
  (load-lit 0 1)
  (ret 0)
  else
  (load-lit 1 1)
  (call 1 builtin/isub 0 1)
  (call 1 factorial 1)
  (tail-call builtin/imul 0 1))
```

### 变量与测试

```lisp
(define-variable *counter*
  (load-lit 0 5)
  (ret 0))

(define-test factorial-test
  (load-lit 0 3)
  (call 0 factorial 0)
  (call 0 builtin/println 0)
  (ret))
```

### 动态调用（apply）

```lisp
(define-function apply-example 2
  (ref 2 builtin/iadd)
  (apply 0 2 0 1)
  (ret 0))
```

### 对比 stack-lisp 阶乘（14 条指令）

```
(local-load 0 n)
(literal 1)
(call builtin/int-less-or-equal?)
(jump-if-not else2)
(literal 1)
(return)
else2
(local-load 0 n)
(literal 1)
(call builtin/isub)
(local-store 1 _1)
(local-load 1 _1)
(call factorial)
(local-store 2 _2)
(local-load 2 _2)
(local-load 0 n)
(tail-call builtin/imul)
```

register-lisp：7 条指令，无 push/pop，全部值走寄存器。

# 与现有基础设施的复用

| 组件 | 复用方式 |
|------|----------|
| `value_t` 及其 tag 编码 | 完全复用，registers 就是 `value_t[]` |
| GC | 复用 mark-sweep；GC root 改从 frame buffer 扫描 |
| `mod_t` / `definition_t` | 基本复用；新增 `function->max_registers` |
| symbol table / bytecode | 复用同一套 serialize/deserialize |
| primitives | 仍然通过 `call_primitive_now()` 执行，C 函数不变 |
| currying | `apply()` 逻辑不变，参数从 registers 提取而非 value_stack |
