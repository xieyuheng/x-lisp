---
title: native x86-64 compilation with precise GC
author: deepseek-v4-pro
date: 2026-05-22
---

# 目标

在 meta-runtime.c 的 value encoding 与 GC 基础上，
设计 meta-lisp 到 native x86-64 的编译方案。
必须 precise GC，不能走编译到 C 的捷径。

# 路线总览

```
meta-lisp 源码
  →  parse / type-check / IR
  →  instruction selection (x86-64)
  →  register allocation
  →  emit machine code

同时 emit 每个函数的 GC map。
```

生成的 native code 与 runtime（C 写的 primitive、GC、currying/apply）link 到一起。

# Frame 与 Calling Convention

## 寄存器分配（x86-64 System V ABI）

```
rax, rcx, rdx, rsi, rdi, r8-r11    caller-saved（callee 可随意破坏）
rbx, rbp, r12-r15                   callee-saved（callee 必须恢复）
rsp                                 栈指针

调用约定：
  前 4 个参数：rdi, rsi, rdx, rcx（value_t）
  其余参数：   C stack push
  返回值：     rax（value_t）
```

## Frame Layout

```
       ┌──────────────────┐
       │ call args (N > 4)│   caller 的 stack frame
       │ ...              │
       │ return address   │   ← CALL 指令压入
rbp →  ├──────────────────┤
       │ saved rbp        │   ← push rbp; mov rbp, rsp
       │ saved rbx        │   ← 如果本函数使用了 rbx
       │ saved r12        │
       │ saved r13        │
       │ saved r14        │
       │ saved r15        │
       │ local 0          │   ← meta-lisp 局部变量（每个 8B value_t）
       │ local 1          │
       │ ...              │
       │ spill 0          │   ← safepoint 时溢出 caller-saved regs
       │ spill 1          │
rsp →  └──────────────────┘
```

## 关键约定

- **所有 local 变量固定分配在 RBP 负偏移处**，每个占用 8 字节，类型始终是 `value_t`。
- 每个局部变量都有一个「home location」在栈上。
- 在非 safepoint 的代码区间，值可以在寄存器中自由流动。
- **在 safepoint 时**，所有还存活于 caller-saved 寄存器中的 tagged value 被溢出（spill）回其 home location。
- Callee-saved 寄存器在函数入口 push，出口 pop。它们中的 tagged value 天然位于栈上。

# GC Map

每个 meta-lisp 函数附带一个 GC map，描述**所有 safepoint 都一致的**信息：
哪些栈上的 8-byte slot 包含活 tagged value。

因为 safepoint 前所有 caller-saved registers 都已溢回 home location，
所以 **safepoint 时刻的 live value 全在栈上**——不在任何 caller-saved 寄存器中。
GC 只需扫描栈。

## GC map 结构

```c
struct gc_map_t {
  uint16_t frame_size;             // frame 总字节数（从 rbp 到 rsp）
  uint8_t  num_callee_saved;      // 本函数 push 了几个 callee-saved 寄存器
  uint8_t  callee_saved_live;     // bitmap：哪些 callee-saved 寄存器在 entry 时是活 tagged value
  uint16_t num_locals;            // 局部变量个数
  uint8_t  local_live[];          // bitmap：哪些 local slot 包含活 tagged value（1B/map + 8 slot/byte）
};
```

注意：`local_live` 是**全函数统一的**。如果在函数末尾某个 local 已死，我们仍然保守地扫描它——这最多导致少量 dead object 无法及时回收。这在短时间内无害。要实现更精确的 per-safepoint liveness，是后续优化。

# Safepoint 设计

## 哪些点需要 safepoint？

不是每个 call 都需要 safepoint。只有**可能触发 GC** 的调用才需要：

1. **分配 primitive**：`cons`、`make-hash`、`make-list` 等——会调用 `gc_maybe_collect()`。
2. **用户定义的 meta-lisp 函数调用**——可能间接触发分配。
3. **apply（动态调用）**——可能调用任意函数。
4. **循环 back-edge**——防止长时间循环不触发 GC。

以下调用**不是** safepoint：
- `iadd`、`int-less-or-equal?` 等纯计算 primitive——不分配，不调用用户函数。
- `car`、`cdr` 等只读访问 primitive。

## safepoint 处的代码模板

```asm
; === safepoint: 调用可能触发 GC 的函数 ===

; Step 1: 将所有活 tagged value 从 caller-saved regs 溢回 home location
mov [rbp-local_0], rdi    ; 如果 rdi 包含活的 tagged value
mov [rbp-local_1], rsi    ; 如果 rsi 包含活的 tagged value
; ... 依 liveness 决定

; Step 2: 执行调用
call some_function

; Step 3: 恢复
mov rdi, [rbp-local_0]
mov rsi, [rbp-local_1]
; ...
```

## liveness 分析

编译器做 backward liveness analysis：
- 对每个 safepoint，计算哪些 local 变量在该点之后还被使用（live-out）。
- 只溢回那些 live 的变量。
- 如果一个 caller-saved 寄存器中的值已经 dead，不需要溢回——GC 不管它。

这样 safepoint 的 overhead 与**当前活变量的个数**成正比，而非与函数中所有变量个数成正比。

# GC 栈遍历

## 触发 GC

`gc_maybe_collect()` 是一个 C 函数。当它判断需要 GC 时：

```c
void gc_maybe_collect(void) {
  if (gc_object_count(global_gc) < gc_threshold) return;

  array_t *roots = make_array();

  // 1. 全局根：module variable definitions
  gc_roots_from_globals(roots);

  // 2. 栈根：遍历 native call stack
  gc_roots_from_stack(roots);

  // 3. mark & sweep
  gc_mark_from_roots(roots);
  gc_sweep();

  array_free(roots);
}
```

## 栈遍历算法

```
void gc_roots_from_stack(array_t *roots) {
  uint64_t *rbp = get_rbp();   // 通过 asm("mov %%rbp, %0") 或 __builtin_frame_address
  uint64_t *rsp_top = get_rsp();

  while (rbp != NULL) {
    void *ret_addr = (void*)rbp[1];   // rbp+8 = return address

    gc_map_t *map = lookup_gc_map(ret_addr);
    if (map == NULL) {
      // 这是一个 C/primitive frame —— 保守扫描（见下文）
      conservative_scan_frame(rbp, roots);
    } else {
      // meta-lisp frame —— 精确扫描
      precise_scan_frame(rbp, map, roots);
    }

    rbp = (uint64_t*)rbp[0];    // rbp+0 = saved rbp (follow chain)
  }
}

void precise_scan_frame(uint64_t *rbp, gc_map_t *map, array_t *roots) {
  // callee-saved registers：位于 rbp 下方，按序排列
  uint8_t *base = (uint8_t*)rbp - 8;   // 第一个 callee-saved 在 rbp-8
  for (int i = 0; i < map->num_callee_saved; i++) {
    if (map->callee_saved_live & (1 << i)) {
      value_t *slot = (value_t*)(base - i * 8);
      maybe_add_root(*slot, roots);
    }
  }

  // local 变量：从 callee-saved 之后开始
  uint8_t *locals_base = base - map->num_callee_saved * 8;
  for (int i = 0; i < map->num_locals; i++) {
    if (bit_is_set(map->local_live, i)) {
      value_t *slot = (value_t*)(locals_base - i * 8);
      maybe_add_root(*slot, roots);
    }
  }
}

void maybe_add_root(value_t value, array_t *roots) {
  if (object_p(value))
    array_push(roots, to_object(value));
}
```

## GC map lookup

需要一个 `ret_addr → gc_map_t*` 的映射。因为 machine code 是按函数生成的，每个函数有自己的一段地址范围。

```c
struct code_desc_t {
  void *code_start;
  void *code_end;
  gc_map_t *gc_map;
};

// 全局排序数组，按 code_start 排序
code_desc_t code_descs[];

gc_map_t *lookup_gc_map(void *ret_addr) {
  // binary search code_descs by ret_addr range
  code_desc_t *desc = bsearch_code_desc(ret_addr);
  return desc ? desc->gc_map : NULL;
}
```

# Primitive / C 互操作

## 核心问题

C 函数（primitive）不遵循 meta-lisp 的 frame 布局和 GC map 约定。
如果 C 函数持有 `value_t` 并回调 meta-lisp（例如 `apply` 内部触发分配），
GC 无法从 C frame 的寄存器/栈中精确识别 tagged value。

## 方案：显式 Root Pinning API

```c
// === meta-lisp/c interop API ===

// 将一个 tagged value 推入 root stack（pin）
void gc_push_root(value_t value);

// 弹出最近推入的 root
void gc_drop_root(void);
```

规则：
1. **如果 C primitive 不会回调 meta-lisp，不需要 pin**——它的返回值在原地，GC 不会误回收。
2. **如果 C primitive 内部可能回调 meta-lisp（apply、map 类函数）**，
   在回调之前必须把所有此后用到的 `value_t` 推入 root stack。
3. 回调返回后 pop。

示例 —— 在 `apply()` 内部：

```c
value_t apply(vm_t *vm, size_t n, value_t target) {
  gc_push_root(target);          // pin: target 在后续 GC 中不会被回收

  // ... 可能触发 GC 的逻辑（分配 args list 等）...

  gc_drop_root();
  return result;
}
```

## 与 shadow stack 的对比

|                          | shadow stack             | root pinning                 |
|--------------------------|--------------------------|------------------------------|
| meta-lisp 代码开销       | 每次写 local 都要 shadow | 只在 safepoint spill（批量） |
| primitive 回调 meta-lisp | 不可能                   | 可以，只需显式 pin           |
| GC 精确性                | 精确                     | 精确                         |
| mental model             | 隐式                     | 显式（类似 Lua C API）       |

root pinning 消除了 shadow stack 的两个关键缺陷：
- meta-lisp 代码没有 per-variable 惩罚
- primitive 可以安全地回调 meta-lisp

# 完整示例：编译阶乘到 x86-64

meta-lisp 源码：
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

编译为 x86-64：

```asm
; function factorial
;   arity = 1, arg in rdi
;   max_registers = 3
;   locals: r0@[rbp-8], r1@[rbp-16], r2@[rbp-24]
;   callee-saved used: none

factorial:
  push rbp
  mov  rbp, rsp
  sub  rsp, 24                 ; 3 locals × 8B

  mov  [rbp-8], rdi            ; r0 = arg (home location)

  ; (load-lit 1 1)
  mov  rax, 0b01001            ; x_int(1) = (1 << 3) | X_INT
  mov  [rbp-16], rax           ; r1 = 1

  ; (call 2 builtin/int-less-or-equal? 0 1)
  ; safepoint: 溢回 caller-saved
  ; rdi = r0, rsi = r1, rax dead after store
  mov  rdi, [rbp-8]            ; arg0: r0
  mov  rsi, [rbp-16]           ; arg1: r1
  ; int-less-or-equal? 不分配——不是 safepoint！
  call int_less_or_equal       ; result in rax
  mov  [rbp-24], rax           ; r2 = result

  ; (jump-if-not 2 else)
  mov  rax, [rbp-24]           ; r2
  cmp  rax, 0b00110            ; x_false
  je   .L_else

  ; then branch
  ; (load-lit 0 1)
  mov  rax, 0b01001
  mov  [rbp-8], rax            ; r0 = 1

  ; (ret 0)
  mov  rax, [rbp-8]
  leave
  ret

.L_else:
  ; (load-lit 1 1)
  mov  rax, 0b01001
  mov  [rbp-16], rax           ; r1 = 1

  ; (call 1 builtin/isub 0 1)
  mov  rdi, [rbp-8]
  mov  rsi, [rbp-16]
  call isub
  mov  [rbp-16], rax           ; r1 = result

  ; (call 1 factorial 1)
  ; safepoint: 可能触发 GC（递归调用可能分配）
  mov  rdi, [rbp-16]           ; arg = r1
  ; rsi, rdx, rcx, rax 都已 dead——无需溢回
  call factorial               ; 可能触发 GC
  mov  [rbp-16], rax           ; r1 = result

  ; (tail-call builtin/imul 0 1)
  ; tail call: 复用当前 frame（leave 后直接 jmp）
  mov  rdi, [rbp-8]            ; arg0 = r0
  mov  rsi, [rbp-16]           ; arg1 = r1
  leave
  jmp  imul                    ; 不 push frame，jmp 替代 call
```

GC map（编译时与 code 一起生成）：

```c
gc_map_t factorial_gc_map = {
  .frame_size       = 24,      // sub rsp, 24
  .num_callee_saved = 0,       // 未使用 callee-saved regs
  .callee_saved_live = 0b0000,
  .num_locals       = 3,       // r0, r1, r2
  .local_live       = {0xFF},  // 全部活（保守）
};
```

# 与 shadow stack 的量化对比

以阶乘的 `(call 1 factorial 1)` 这一个 safepoint 为例：

|                    | shadow stack                        | stack map + spill             |
|--------------------|-------------------------------------|-------------------------------|
| 每次写 local       | `mov [ss+X], value`（额外 1 store） | 无                            |
| safepoint          | 可能不需要（栈上已有）              | spill live regs，此处只有 rdi |
| code size overhead | 所有 store 指令增加 1 条            | 仅在 safepoint 前增加少量 mov |
| primitive 回调     | 不允许                              | 允许（root pinning API）      |

# 实现难点

## 1. 汇编代码生成

需要实现 x86-64 的 assembler（或使用已有的 lightweight 库）。
挑战不大——x86-64 指令编码已有成熟实现（如 asmjit、Xbyak 等可参考）。

## 2. 寄存器分配

介于 SSA 构造和线性扫描之间。对于 meta-lisp 的函数规模（通常在几百条指令以内），
线性扫描 + home location spill 足够。

## 3. liveness 分析与 safepoint 溢出优化

需要 backward liveness 分析来确定 safepoint 处哪些 value 必须溢回。
这是经典 compiler 问题，有标准算法。

## 4. GC map 与 symbol table 的序列化

代码本身、GC map、symbol table 全部落在 native binary 中。

变体方案：**不要生成 ELF binary，而是生成「native code blob + metadata」数据结构**。
meta-lisp 编译器输出：
- `code_blob[]`：native machine code
- `gc_maps[]`：GC 元数据
- `symbol_table[]`：symbol → address 的映射
- `relocations[]`：需要 link 时 fixup 的外部符号

这些数据可以被 loader 直接 mmap 并执行（`mmap + mprotect + 解析 relocations`），
保留对 xvm 一样的开发体验：修改 .meta 源、重新编译、直接加载——无需传统 link 步骤。

## 5. 尾调用的精确 GC

tail call 用 `leave; jmp target` 实现。
此时 callee **直接使用 caller 的 frame**，不做新的 push rbp。
GC 遍历时看到此 frame 的 return address 指向 **caller 的 caller**，
它会用 caller 的 GC map 扫描此 frame——这是正确的，
因为 tail call 没有引入新的 live variable。

唯一要注意：`leave` 之前 callee 必须把所有活值溢回栈，
因为 `leave` 之后 `rbp` 指向的是 caller 的 caller 的 frame。
在 `jmp` 之前，活值在栈上的 home location 仍可通过 caller caller 的 GC map 找到。

## 6. 与 primitives 的参数传递兼容

meta-lisp native code 和 C primitive 之间必须 ABi 兼容：
- `value_t` 是 `uint64_t`，与 x86-64 `size_t` 一致
- 调用 C 函数时使用 System V ABI（rdi, rsi, ...）

这天然成立。

# 总结

| 维度                     | 评价                                        |
|--------------------------|---------------------------------------------|
| GC 精确性                | 精确——基于 GC maps + safepoint spill      |
| meta-lisp 代码开销       | 仅在 safepoint 处 spill，非 per-variable    |
| primitive 回调 meta-lisp | 允许——通过显式 root pinning API           |
| 实现复杂度               | 高——需要 assembler、liveness、GC map 逻辑 |
| 未来扩展性               | 好——后续可做 per-safepoint liveness 优化  |
