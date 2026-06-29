---
title: stack-lisp vm redesign
author: deepseek-v4-pro
date: 2026-05-22
---

# 目标

在 stack-lisp.c 的 value encoding 与 GC 基础上，设计全新的 VM。

# Frame 设计

## 决策：连续 frame 栈

每个 frame 不再是堆上独立的 `frame_t`，而是存储在一个大的连续 buffer 中：

```
┌────────────────────────────────────────────────┐
│  frame buffer（连续内存，可动态增长）          │
│                                                │
│  header  regs          header  regs            │
│ ┌──────┬─────────┐   ┌──────┬─────────┐        │
│ │caller│ r0 ...  │   │callee│ r0 ...  │   ...  │
│ └──────┴─────────┘   └──────┴─────────┘        │
│  ← 低地址                  ← sp 当前帧         │
└────────────────────────────────────────────────┘
```

### frame header

```c
struct frame_t {
  uint8_t *return_ip;      // caller 的下一条指令地址
  uint8_t  return_rd;      // caller 的哪个 rd 接收返回值
  uint32_t local_count;     // 本 frame 的寄存器数量
};
```

header 之后紧跟着就是 `value_t[local_count]` 的 local 数组。
所有寄存器访问通过 `sp + offset` 计算，不需要指针间接。

### call

```
OP_CALL rd, symbol, r_arg0, ..., r_argN
```

1. 计算新 frame 大小 = `sizeof(frame_t) + local_count * sizeof(value_t)`
2. 在 frame buffer 末尾 bump-allocate 新 frame
3. 写入 header：`return_ip = 下一条指令`, `return_rd = rd`
4. 写入 locals：`r0..r_argN` 拷贝自 caller 的 r_arg0..r_argN；剩余寄存器清零
5. sp 移动到新 frame

### ret

```
OP_RETURN rs
```

1. 从当前 frame header 读取 `return_ip` 和 `return_rd`
2. 将当前 frame 的 `locals[rs]` 拷贝到 caller frame 的 `locals[return_rd]`
3. sp 移回 caller frame
4. ip = return_ip

### tail call

```
OP_TAIL_CALL symbol, r_arg0, ..., r_argN
```

1. 不需要 rd operand，继承当前 frame 的 `return_ip` 和 `return_rd`。
2. 直接在**当前 frame 的位置**创建新 frame：如果 callee 的 local_count 和 arity 小于等于当前 frame，直接覆盖寄存器区域；否则 resize frame buffer
3. 写入 regs：`r0..r_argN` 拷贝自 caller 的 r_arg0..r_argN
4. ip 跳转到 callee 入口
5. 当 callee OP_RETURN 时，`return_ip` 和 `return_rd` 仍然是**原来 caller 的 caller** 的
   （因为 TAIL_CALL 没有覆盖 header）

关键：TAIL_CALL 不修改 `return_ip` 和 `return_rd`，所以 callee 的 RET 直接返回到调用链上上一层。

### 备选方案：固定返回值寄存器（r0 + vm->return_value）

当前设计中 frame header 保存了 `return_rd`——RET 时用它决定把返回值写入 caller 的哪个寄存器。
也可以用一种更简单的约定：**返回值永远放在 callee 的 r0**，frame header 不再记录 `return_rd`。

两种方案的对比：

#### 方案 A：return_rd in frame header（当前设计）

```
frame header: return_ip(8B) + return_rd(1B) + local_count(4B)

OP_CALL rd, symbol, r_arg0, ...
    → callee.return_rd = rd

OP_RETURN rs：
    value = callee.locals[rs]
    caller.locals[callee.return_rd] = value
    sp 回退，ip = callee.return_ip
```

TAIL_CALL / TAIL_APPLY 必须同时保留 `return_ip` 和 `return_rd`。

#### 方案 B：固定返回值寄存器

```
frame header: return_ip(8B) + local_count(4B)   // 省去 return_rd

OP_CALL symbol, r_arg0, ...           // 无需 rd operand
    → callee.return_ip = 下一条指令

OP_RETURN：                            // 无需 rs operand，1 字节
    vm->return_value = callee.locals[r0]
    sp 回退，ip = callee.return_ip

OP_LOAD_RETVAL rd：                    // 新增指令，rd = vm->return_value
```

TAIL_CALL / TAIL_APPLY 只需保留 `return_ip`。

#### 对比

| 维度 | 方案 A（return_rd） | 方案 B（固定返回） |
|---|---|---|
| Frame header 大小 | `return_ip` + `return_rd` + `local_count` | `return_ip` + `local_count` |
| OP_RETURN 编码 | 2 bytes (op + rs) | 1 byte (op only) |
| OP_CALL 编码 | 含 rd operand | 无需 rd |
| 非尾调用后取结果 | 零开销，已在 `locals[rd]` | 需额外 `OP_LOAD_RETVAL rd` |
| tail_call 复杂度 | 保留 `return_ip` + `return_rd` | 只保留 `return_ip` |
| tail_apply 复杂度 | 同上 | 同上 |

#### 对 tail_apply 的影响

方案 A 下 `tail_apply` 需要处理两个字段：

```c
void tail_apply(vm_t *vm, uint8_t func_reg, uint8_t argc, const uint8_t *arg_regs) {
    frame_t *current = (frame_t *)vm->sp;
    uint8_t *old_ip = current->return_ip;
    uint8_t old_rd = current->return_rd;
    // 覆盖当前帧 ...
    current->return_ip = old_ip;
    current->return_rd = old_rd;
    // ...
}
```

方案 B 下只需处理 `return_ip`：

```c
void tail_apply(vm_t *vm, uint8_t func_reg, uint8_t argc, const uint8_t *arg_regs) {
    frame_t *current = (frame_t *)vm->sp;
    uint8_t *old_ip = current->return_ip;
    // 覆盖当前帧 ...
    current->return_ip = old_ip;
    // ...
}
```

方案 B 的核心优势：tail call 链上的所有函数共享同一个返回目标（`vm->return_value`），不会出现「这个 frame 的 return_rd 到底属于调用链上哪个 caller」的混淆。无论中间经过多少次 tail call，最终的 RET 总是把 r0 写入 `vm->return_value`，最顶层的 caller 通过 `OP_LOAD_RETVAL` 取走。

代价是非尾调用后多一条 `OP_LOAD_RETVAL rd` 指令。tail call 密集型代码受益于更短的 frame header 和更简单的 tail 逻辑；普通代码多付出 1 条指令。

### GC root scanning

从 frame buffer 底扫描到 sp：

```
for (ptr = frame_buffer_base; ptr < sp; ) {
  frame_t *header = (frame_t *)ptr;
  value_t *regs = (value_t *)(ptr + sizeof(frame_t));
  for (i = 0; i < header->local_count; i++)
    if (object_p(regs[i]))
      array_push(roots, to_object(regs[i]));
  ptr += sizeof(frame_t) + header->local_count * sizeof(value_t);
}
```

结构和连续栈天然支持 GC 遍历。

## 与 x86 + C calling convention 的对比

不是「所有参数用栈传递」。连续 frame buffer 看起来像 C stack，但不同的在于：
- 每个 frame 有自己的局部变量数组
- 参数通过 caller 把值拷贝进 callee 的 r0..rN，而非在 caller 的栈区域放参数
- 没有 caller-saved/callee-saved 协调

# 指令集

## op_t

```c
typedef enum {
  OP_LOAD_LITERAL,       // rd = literal_value
  OP_MOVE,           // rd = rs
  OP_LOAD_GLOBAL,    // rd = global(symbol)
  OP_STORE_GLOBAL,   // global(symbol) = rs
  OP_JUMP,          // ip += offset
  OP_JUMP_IF,        // if rs != x_false then ip += offset
  OP_JUMP_IFNOT,     // if rs == x_false then ip += offset
  OP_CALL,          // rd = symbol(r_arg0, ..., r_argN)
  OP_TAIL_CALL,      // tail call symbol(r_arg0, ..., r_argN)
  OP_APPLY,         // rd = apply(func_reg, r_arg0, ..., r_argN)
  OP_TAIL_APPLY,     // tail apply func_reg(r_arg0, ..., r_argN)
  OP_REF,           // rd = x_object(definition)
  OP_RETURN,           // return rs
} op_t;
```

## instr_t

```c
struct instr_t {
  op_t op;
  union {
    struct { uint8_t rd; value_t value; } load_lit;

    struct { uint8_t rd; uint8_t rs; } mov;

    struct { uint8_t rd; uint32_t symbol; } load_global;
    struct { uint8_t rs; uint32_t symbol; } store_global;

    struct { int32_t offset; } jump;
    struct { uint8_t rs; int32_t offset; } jump_if;
    struct { uint8_t rs; int32_t offset; } jump_ifnot;

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
    } tail_call;

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
    } tail_apply;

    struct { uint8_t rd; uint32_t symbol; } ref;

    struct { uint8_t rs; } ret;
  };
};
```

# 字节码编码

```
指令            字节数
────────────────────────────────────────
OP_LOAD_LITERAL      1 + 1 + 8 = 10       opcode(1B) rd(1B) value(8B)
OP_MOVE          1 + 1 + 1 = 3        opcode(1B) rd(1B) rs(1B)
OP_LOAD_GLOBAL   1 + 1 + 4 = 6        opcode(1B) rd(1B) symbol(4B)
OP_STORE_GLOBAL  1 + 1 + 4 = 6        opcode(1B) rs(1B) symbol(4B)
OP_JUMP         1 + 4 = 5            opcode(1B) offset(4B)
OP_JUMP_IF       1 + 1 + 4 = 6        opcode(1B) rs(1B) offset(4B)
OP_JUMP_IFNOT    1 + 1 + 4 = 6        opcode(1B) rs(1B) offset(4B)
OP_CALL         1 + 1 + 4 + 1 + N    opcode(1B) rd(1B) symbol(4B) argc(1B) args[N]
OP_TAIL_CALL     1 + 4 + 1 + N        opcode(1B) symbol(4B) argc(1B) args[N]
OP_APPLY        1 + 1 + 1 + 1 + N    opcode(1B) rd(1B) func(1B) argc(1B) args[N]
OP_TAIL_APPLY    1 + 1 + 1 + N        opcode(1B) func(1B) argc(1B) args[N]
OP_REF          1 + 1 + 4 = 6        opcode(1B) rd(1B) symbol(4B)
OP_RETURN          1 + 1 = 2            opcode(1B) rs(1B)
```

## symbol 字段的 resolution

序列化时 `symbol` 写入 `uint32_t` index，对应 module 的 symbol table。
加载时分两阶段：先注册所有 definition 名字，再遍历每条指令把 symbol_index
resolve 为 `definition_t *`。

# S-expression 语法

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

`local_count` 由 assembler 在扫描 body 时自动计算——取所有被使用的寄存器 index 的最大值 + 1。

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

# 与现有基础设施的复用

| 组件                     | 复用方式                                               |
|--------------------------|--------------------------------------------------------|
| `value_t` 及其 tag 编码  | 完全复用，locals 就是 `value_t[]`                      |
| GC                       | 复用 mark-sweep；GC root 改从 frame buffer 扫描        |
| `mod_t` / `definition_t` | 基本复用；新增 `function->local_count`                 |
| symbol table / bytecode  | 复用同一套 serialize/deserialize                       |
| primitives               | 仍然通过 `call_primitive_now()` 执行，C 函数不变       |
| currying                 | `apply()` 逻辑不变，参数从 locals 提取而非 value_stack |

# apply 的实现

## 全局变化

旧设计中参数通过 `value_stack` 的 push/pop 传递，新设计参数编码在指令的寄存器索引中。
因此 `apply()` 的签名需要改变——不再从 value_stack pop target 和 args，
而是从当前帧的 `locals[]` 中按索引读取。

与旧设计 `apply(vm, n, target)` 对应的新签名为：

```c
// vm/apply.h
void apply(vm_t *vm, uint8_t rd, uint8_t func_reg, uint8_t argc, const uint8_t *arg_regs);
void tail_apply(vm_t *vm, uint8_t func_reg, uint8_t argc, const uint8_t *arg_regs);
```

- `rd`：结果写入的目标寄存器索引
- `func_reg`：存放函数对象的寄存器索引
- `argc`：参数个数
- `arg_regs[]`：每个参数所在的寄存器索引

`tail_apply` 不需要 `rd` operand——它继承当前 frame header 中的 `return_rd`。

## 辅助宏

```c
// 从 sp 获取当前帧的 locals 数组
static inline value_t *vm_current_locals(vm_t *vm) {
    frame_t *frame = (frame_t *)vm->sp;
    return (value_t *)((uint8_t *)frame + sizeof(frame_t));
}

// 寄存器读写
#define reg_get(locals, index)  ((locals)[(index)])
#define reg_put(locals, index, v) ((locals)[(index)] = (v))
```

## apply()

```c
void apply(vm_t *vm, uint8_t rd, uint8_t func_reg,
           uint8_t argc, const uint8_t *arg_regs) {
    value_t *locals = vm_current_locals(vm);
    value_t target = reg_get(locals, func_reg);

    // 从当前帧寄存器中收集参数值到临时数组
    value_t args[argc];
    for (uint8_t i = 0; i < argc; i++) {
        args[i] = reg_get(locals, arg_regs[i]);
    }

    vm_push_root(vm, target);

    if (definition_p(target)) {
        apply_definition(vm, locals, rd, to_definition(target), argc, args);
    } else if (curry_p(target)) {
        apply_curry(vm, locals, rd, to_curry(target), argc, args);
    } else {
        who_printf("apply: unhandled value\n");
        exit(1);
    }

    vm_drop_root(vm);
}
```

## call_primitive_on_args()

旧设计中 `call_primitive_now(vm, primitive)` 通过 `vm_pop(vm)` 从 value_stack 取参数。
新设计改成接收参数数组。

```c
void call_primitive_on_args(const primitive_t *primitive,
                             value_t *locals, uint8_t rd,
                             size_t arity, value_t *args) {
    switch (primitive->fn_kind) {
    case X_FN_0:
        locals[rd] = primitive->fn_0();
        return;
    case X_FN_1:
        locals[rd] = primitive->fn_1(args[0]);
        return;
    case X_FN_2:
        locals[rd] = primitive->fn_2(args[0], args[1]);
        return;
    case X_FN_3:
        locals[rd] = primitive->fn_3(args[0], args[1], args[2]);
        return;
    case X_FN_4:
        locals[rd] = primitive->fn_4(args[0], args[1], args[2], args[3]);
        return;
    case X_FN_5:
        locals[rd] = primitive->fn_5(args[0], args[1], args[2], args[3], args[4]);
        return;
    case X_FN_6:
        locals[rd] = primitive->fn_6(args[0], args[1], args[2], args[3], args[4], args[5]);
        return;
    case X_FN_N:
        // raw VM access——需要决策如何处理（见底部「待决策点」）
        who_printf("X_FN_N not supported in new apply\n");
        exit(1);
    }
}
```

## vm_frame_call()

为 callee 在 frame buffer 末尾 bump-allocate 一个新帧，拷贝参数，修改 sp/ip。

```c
void vm_frame_call(vm_t *vm, const function_t *func,
                   uint8_t return_rd, size_t argc, value_t *args) {
    size_t new_frame_size = sizeof(frame_t) +
                            func->local_count * sizeof(value_t);
    uint8_t *new_sp = vm->frame_buffer_ptr;
    vm->frame_buffer_ptr += new_frame_size;

    frame_t *new_frame = (frame_t *)new_sp;
    new_frame->return_ip = vm->ip;   // caller 的下一条指令地址
    new_frame->return_rd = return_rd;
    new_frame->local_count = func->local_count;

    value_t *callee_locals = (value_t *)(new_sp + sizeof(frame_t));
    for (size_t i = 0; i < argc; i++)
        callee_locals[i] = args[i];
    for (size_t i = argc; i < func->local_count; i++)
        callee_locals[i] = x_void;

    vm->sp = new_sp;
    vm->ip = buffer_raw_bytes(func->buffer);
}
```

## vm_frame_tail_override()

TAIL_CALL 和 TAIL_APPLY 从当前帧位置覆盖，保留 `return_ip` 和 `return_rd`。

```c
void vm_frame_tail_override(vm_t *vm, const function_t *func,
                             size_t argc, value_t *args) {
    frame_t *current = (frame_t *)vm->sp;
    uint8_t *old_ip = current->return_ip;
    uint8_t old_rd = current->return_rd;

    size_t new_frame_size = sizeof(frame_t) + func->local_count * sizeof(value_t);
    size_t old_frame_size = sizeof(frame_t) + current->local_count * sizeof(value_t);

    if (new_frame_size > old_frame_size) {
        // 需要扩容 frame buffer
        // (memmove 处理重叠 + bump pointer 调整)
        size_t offset = vm->sp - vm->frame_buffer_base;
        vm->frame_buffer_base = realloc(vm->frame_buffer_base,
                                        offset + new_frame_size);
        vm->sp = vm->frame_buffer_base + offset;
    }

    // 直接在当前帧位置写入新 header（保留 return_ip/return_rd）
    current = (frame_t *)vm->sp;
    current->return_ip = old_ip;
    current->return_rd = old_rd;
    current->local_count = func->local_count;

    value_t *callee_locals = (value_t *)((uint8_t *)current + sizeof(frame_t));
    for (size_t i = 0; i < argc; i++)
        callee_locals[i] = args[i];
    for (size_t i = argc; i < func->local_count; i++)
        callee_locals[i] = x_void;

    vm->ip = buffer_raw_bytes(func->buffer);
}
```

## apply_definition()

```c
void apply_definition(vm_t *vm, value_t *locals, uint8_t rd,
                      definition_t *def, uint8_t argc, value_t *args) {
    if (!definition_has_arity(def)) {
        who_printf("definition has no arity: %s\n", def->name);
        exit(1);
    }
    size_t arity = definition_arity(def);

    if (argc == arity) {
        switch (def->kind) {
        case PRIMITIVE_DEFINITION:
            call_primitive_on_args(def->primitive_definition.primitive,
                                   locals, rd, arity, args);
            return;
        case FUNCTION_DEFINITION:
            vm_frame_call(vm, definition_function(def), rd, arity, args);
            return;
        case VARIABLE_DEFINITION:
            unreachable();
        }
    } else if (argc < arity) {
        // 部分应用 (currying)：创建 curry 对象
        curry_t *curry = make_curry(x_object(def), arity - argc, argc);
        for (size_t i = 0; i < argc; i++)
            curry->args[i] = args[i];
        reg_put(locals, rd, x_object(curry));
    } else {
        // 过多参数 (over-application)
        // 先用 arity 个参数调用，结果落在 locals[rd]
        // 然后对结果递归 apply 剩余参数
        if (def->kind == PRIMITIVE_DEFINITION) {
            call_primitive_on_args(def->primitive_definition.primitive,
                                   locals, rd, arity, args);
            value_t result = reg_get(locals, rd);
            value_t *rest_args = args + arity;
            if (definition_p(result))
                apply_definition(vm, locals, rd, to_definition(result),
                                 argc - arity, rest_args);
            else if (curry_p(result))
                apply_curry(vm, locals, rd, to_curry(result),
                            argc - arity, rest_args);
        } else {
            // FUNCTION 的 over-application：
            // vm_frame_call 会修改 sp/ip，callee 会返回到调用链的 caller。
            // 需要在返回时继续 apply 剩余参数——见底部「待决策点①」。
            vm_frame_call(vm, definition_function(def), rd, arity, args);
        }
    }
}
```

## apply_curry()

逻辑与旧版一致，区别在于参数来自 `args[]` 数组、结果直接写 `locals[rd]`。

```c
void apply_curry(vm_t *vm, value_t *locals, uint8_t rd,
                 curry_t *curry, uint8_t argc, value_t *args) {
    if (argc == curry->arity) {
        // 合并 curried args 和新 args
        size_t total = argc + curry->size;
        value_t merged[total];
        for (size_t i = 0; i < argc; i++)
            merged[i] = args[i];
        for (size_t i = 0; i < curry->size; i++)
            merged[argc + i] = curry->args[i];

        if (definition_p(curry->target))
            apply_definition(vm, locals, rd,
                to_definition(curry->target), total, merged);
        else if (curry_p(curry->target))
            apply_curry(vm, locals, rd,
                to_curry(curry->target), total, merged);

    } else if (argc < curry->arity) {
        // 继续 curry
        curry_t *new_curry = make_curry(x_object(curry),
                                         curry->arity - argc, argc);
        for (size_t i = 0; i < argc; i++)
            new_curry->args[i] = args[i];
        reg_put(locals, rd, x_object(new_curry));

    } else {
        // over-application: 先用 curry->arity 个参数
        apply_curry(vm, locals, rd, curry, curry->arity, args);
        value_t result = reg_get(locals, rd);
        value_t *rest_args = args + curry->arity;
        if (definition_p(result))
            apply_definition(vm, locals, rd, to_definition(result),
                             argc - curry->arity, rest_args);
        else if (curry_p(result))
            apply_curry(vm, locals, rd, to_curry(result),
                        argc - curry->arity, rest_args);
    }
}
```

## tail_apply()

```c
void tail_apply(vm_t *vm, uint8_t func_reg,
                uint8_t argc, const uint8_t *arg_regs) {
    value_t *locals = vm_current_locals(vm);
    value_t target = reg_get(locals, func_reg);

    value_t args[argc];
    for (uint8_t i = 0; i < argc; i++)
        args[i] = reg_get(locals, arg_regs[i]);

    if (definition_p(target)) {
        definition_t *def = to_definition(target);
        if (def->kind == FUNCTION_DEFINITION
            && definition_has_arity(def)
            && argc == definition_arity(def)) {
            // 精确匹配：tail call 直接覆盖当前帧
            vm_frame_tail_override(vm, definition_function(def), argc, args);
            return;
        }
    }

    // fallback：写入一个临时寄存器，由后续 ret 返回
    apply(vm, 0, func_reg, argc, arg_regs);
}
```

## vm_execute_instr() 中的分发

```c
case OP_APPLY:
    apply(vm,
        instr.apply.rd,
        instr.apply.func,
        instr.apply.argc,
        instr.apply.args);
    break;

case OP_TAIL_APPLY:
    tail_apply(vm,
        instr.apply.func,
        instr.apply.argc,
        instr.apply.args);
    break;
```

## 待决策点

### ① FUNCTION over-application 的返回处理

`apply_definition()` 中 `argc > arity` 的场景下，`vm_frame_call()` 会修改 sp/ip 进入 callee。
当 callee 执行 `OP_RETURN` 时，sp 回退到 caller 帧，ip 跳转到 caller 的 `return_ip`。
但此时 caller 还需要用剩余参数继续 apply 返回值。

**方案 A：apply 重入栈**

在 `vm_t` 中新增一个「apply 重入栈」，记录每次 apply 调用后还需要处理的剩余参数。
OP_RETURN 检查此栈并决定是继续执行 call 方下一条指令还是进入 apply 逻辑。

```c
struct apply_entry {
    uint8_t rd;
    uint8_t argc;
    uint8_t args[];
};
stack_t *apply_stack; // stack<apply_entry*>
```

RET 时：

```c
case OP_RETURN: {
    frame_t *frame = (frame_t *)vm->sp;
    uint8_t return_rd = frame->return_rd;
    vm->ip = frame->return_ip;
    vm->sp -= sizeof(frame_t) + frame->local_count * sizeof(value_t);

    // ... 把返回值写入 caller frame 的 locals[return_rd] ...

    if (stack_length(vm->apply_stack) > 0) {
        apply_entry_t *entry = stack_pop(vm->apply_stack);
        value_t *caller_locals = vm_current_locals(vm);
        value_t result = reg_get(caller_locals, return_rd);
        // 继续 apply...
        free(entry);
    }
    break;
}
```

**方案 B：编译器保证**

编译器在生成代码时不产生 `(apply ...)` 中 argc 超过函数 arity 的情况，
而是展开为 `call` + 对结果单独 apply 的组合指令。

### ② X_FN_N 原语的兼容

`X_FN_N` 类型的原语接收原始 `vm_t*`，可以自由操作 value_stack 和 frame_stack。
新设计中不再有 value_stack，这些原语需要适配：

- **选项 a**：保留一个兼容用的 value_stack 在 vm_t 中，仅在 X_FN_N 原语被调用时使用
- **选项 b**：逐步改写所有 X_FN_N 原语为固定 arity 的 X_FN_k 形式，参数从 locals 传递
