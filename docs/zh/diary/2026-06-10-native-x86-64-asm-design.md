---
title: native x86-64 汇编语言设计
authors: [xieyuheng, deepseek-v4-pro]
date: 2026-06-10
---

# 前言

本文在 2026-05-22 的设计文档（native x86-64 compilation with precise GC）基础上，
设计一套嵌入在 Lisp 语法中的 x86-64 汇编语言与汇编器。

目标：

- 零外部依赖——不依赖 GNU as、NASM、asmjit 等
- 生成「native code blob + metadata」数据结构
- 汇编器用 TypeScript 实现（[meta-lisp.js] 内）
- 汇编语言是 meta-lisp 编译器后端（代码生成 + 寄存器分配）的 target IR
- 二进制布局与 C `__attribute__((packed))` struct 兼容

# 顶层形式

## `(define-code)`

定义一个可执行函数。

```lisp
(define-code <name>
  (block <name> <instr> ...)
  ...)
```

- 函数的第一个 block 是 entry block。
- 每个 `define-code` 的 label 自动保留 `-8` slot——`name - 8` 处存放指向 `define-metadata` 的指针。

## `(define-data)`

定义一个具名数据块。

```lisp
(claim <name> <type>)
(define-data <name>
  (<field-name> <value>)
  ...)
```

- `claim` 声明 `<name>` 的类型——必定是一个 `define-struct` 所定义的类型。
- `define-data` 按 struct 字段顺序填入值。
- 字段值可以是字面量、`(struct ...)`（嵌入子 struct）、`(pointer (struct ...))`（匿名数据 slot + 指针）、`(pointer "..." )`（匿名字符串 + 指针）。

## `(claim-code-metadata)`

声明所有 `define-code` 的 metadata 类型。

```lisp
(claim-code-metadata <type>)
```

- 无 `<name>` 参数——全局生效。
- `<type>` 必须是一个 `define-struct` 所定义的类型。
- 在 Mod 中记录，用于后续验证和布局计算。

## `(define-metadata)`

为指定 label 的 `-8` slot 填充元数据。

语法与 `define-data` 一致：

```lisp
(define-metadata <name>
  (<field-name> <value>)
  ...)
```

- `<name>` 对应一个 `define-code` 或其他顶层 label。
- 元数据类型由 `claim-code-metadata` 全局声明。
- 汇编器在 `<name>` 的 `-8` 位置填入指向该 struct 实例的指针。

## `(define-struct)`

声明结构体类型，定义字段偏移量。

```lisp
(define-struct <name>-t
  (<field-name> <type>)
  ...)
```

- 类型名必须以 `-t` 结尾。
- `<type>` 可以是原始类型（`int64-t` 等）、`string-t`、`(pointer-t <T>)` 或另一个 `define-struct` 类型名。
- 汇编器据此计算每个字段的偏移量和 struct 总大小。

## `(define-space)`

分配未初始化的内存空间（BSS 语义）。

```lisp
(define-space <name> <size>)
```

# 类型系统

## 原始类型

| 类型       | 大小    |
|------------|---------|
| `char-t`   | 1 byte  |
| `uint8-t`  | 1 byte  |
| `uint16-t` | 2 bytes |
| `uint32-t` | 4 bytes |
| `uint64-t` | 8 bytes |
| `int8-t`   | 1 byte  |
| `int16-t`  | 2 bytes |
| `int32-t`  | 4 bytes |
| `int64-t`  | 8 bytes |

## 特殊类型

| 类型              | 大小    | 语义                                                   |
|-------------------|---------|--------------------------------------------------------|
| `string-t`        | 8 bytes | 等价于 `(pointer-t char-t)`；C 意义上的 `const char *` |
| `(pointer-t <T>)` | 8 bytes | 指向 `<T>` 类型数据的指针（uint64）                    |
| `<struct>-t`      | 按定义  | 嵌入的 struct 类型                                     |

`string-t` 不是 flexible array member——它可以出现在 struct 的任意位置，语义是指针。

# 操作数（operand）

所有操作数都是显式类型化的——无上下文推断。

## `(reg <name>)`

物理寄存器。

```lisp
(reg rax) (reg rcx) (reg rdx) (reg rbx) (reg rsp) (reg rbp)
(reg rsi) (reg rdi) (reg r8) ... (reg r15)
```

## `(imm <value>)`

立即数。

```lisp
(imm 42)
```

## `(label <name> [<subfield> ...])`

标签引用，可选带字段路径。

```lisp
(label factorial)
(label my-rect bottom-right x)
```

`(label ...)` 本身只标识一个符号位置。在生成 x86-64 指令时，需要包裹 `label-imm` 或 `label-deref`。

## `(label-imm <label>)`

将 label 的地址作为 64-bit 立即数。汇编器生成 `movabs` 编码 + 重定位项。

```lisp
(label-imm (label factorial))
(label-imm (label my-rect bottom-right x))
```

## `(label-deref <label>)`

对 label 的 RIP 相对寻址。汇编器编码为 `[rip + disp32]`。

```lisp
(label-deref (label some-constant))
(label-deref (label my-rect bottom-right x))
```

## `(reg-deref <reg> <disp>)` / `(reg-deref <reg> <index> <scale> [<disp>])`

寄存器相对寻址，支持完整 SIB。

```lisp
(reg-deref (reg rbp) -8)                        ;; [rbp - 8]
(reg-deref (reg rbp) (reg rax) 8)               ;; [rbp + rax*8]
(reg-deref (reg rbp) (reg rax) 8 -16)           ;; [rbp + rax*8 - 16]
(reg-deref (reg rax))                           ;; [rax]
```

汇编器按参数个数/类型判断模式：
- 1 个 `reg` + 1 个 `imm` → `[base + disp]`
- 2 个 `reg` + 1 个 `imm` → `[base + index*scale]`
- 2 个 `reg` + 2 个 `imm` → `[base + index*scale + disp]`

## `(cc <code>)`

条件码，用于 `j` 指令。

```lisp
(cc e) (cc ne) (cc l) (cc le) (cc g) (cc ge)
(cc b) (cc be) (cc a) (cc ae)
```

## `(var <name>)`

Pre-register-allocation 阶段的虚拟变量。有 `var` 的汇编语言是中间表示（IR）。
寄存器分配 pass 将所有 `var` 替换为 `(reg ...)` 或 `(reg-deref ...)`。
序列化阶段遇到 `var` 即报错。

## `(struct <type>-t (<field> <value>) ...)` / `(struct (<field> <value>) ...)`

在 `define-data` 字段值位置表示嵌入的 struct 字面量。

```lisp
;; 带类型名
(struct point-t (x 0) (y 0))

;; 省略类型名（当 claim 已声明字段类型时）
(struct (x 0) (y 0))
```

## `(pointer <value>)`

在 `define-data` 或 `define-metadata` 的 `(pointer-t <T>)` 字段值位置，
创建匿名 data slot 并填入指向它的指针。

```lisp
;; 匿名 struct slot
(pointer (struct
           (frame-size 24)
           (callee-saved-count 0)
           ...))

;; 匿名字符串 slot
(pointer "hello")
```

# 指令（instruction）

操作码 + 操作数。NASM 方向（dst, src）。

## 数据移动

```lisp
(mov (reg rax) (reg rdi))
(mov (reg rax) (imm 42))
(mov (reg rax) (label-imm (label factorial)))
(mov (reg rax) (label-deref (label constant)))
(mov (reg rax) (reg-deref (reg rbp) -8))
(mov (reg-deref (reg rbp) -8) (reg rax))
(mov (reg-deref (reg rbp) -8) (imm 42))
(mov (reg-deref (reg rbp) -8) (label-imm (label factorial)))
```

## 算术

```lisp
(add (reg rax) (reg rdi))
(add (reg rax) (imm 1))
(sub (reg rax) (reg rdi))
(sub (reg rsp) (imm 24))
(imul (reg rax) (reg rdi))
(cmp (reg rax) (reg rdi))
(cmp (reg rax) (imm 0))
(test (reg rax) (reg rax))
```

## 栈

```lisp
(push (reg rbp))
(pop (reg rbp))
```

## 控制流

```lisp
(call (label helper))                       ;; 直接调用
(call (reg-deref (reg rax)))                ;; 间接调用
(ret)
(jmp (label loop))
(j (cc e) (label else))
(j (cc ne) (label loop))
(j (cc l) (label less))
(j (cc g) (label greater))
```

## 位运算

```lisp
(and (reg rax) (reg rdi))
(or (reg rax) (reg rdi))
(xor (reg rax) (reg rax))
(shl (reg rax) (imm 1))
(shr (reg rax) (imm 1))
```

## 地址计算

```lisp
(lea (reg rax) (reg-deref (reg rbp) (reg rcx) 8 -16))
```

# 约定

## `-8` slot

- 每个有 `define-metadata` 的 label 自动保留 `-8` slot。
- label 的地址指向 code/data 的起始位置。
- `label - 8` 处存放一个 8-byte 指针，指向与该 label 关联的 metadata struct 实例。

```
                    ┌──────────────────┐
                    │ metadata ptr     │  ← label_addr - 8
label_addr →        ├──────────────────┤
                    │ push rbp         │
                    │ ...              │
                    └──────────────────┘
```

运行时 O(1) 访问：

```c
function_metadata_t* meta = *(function_metadata_t**)((char*)func_ptr - 8);
uint16_t arity = meta->arity;
```

## 序列化格式

- 所有 struct 按 `__attribute__((packed))` 布局——字段间无 padding。
- `string-t` / `(pointer-t <T>)` 字段存有指针值的占位地址 + 重定位项。
- 每个值占 8 bytes（64-bit 指针）。
- Loader mmap 后处理重定位：将占位地址替换为 `blob_base + offset`。

# 示例

## 函数 metadata 类型

```lisp
(define-struct gc-map-t
  (frame-size uint16-t)
  (callee-saved-count uint8-t)
  (callee-saved-live uint8-t)
  (local-count uint16-t)
  (local-live uint8-t))

(define-struct function-metadata-t
  (arity uint16-t)
  (flags uint16-t)
  (gc-map gc-map-t)
  (name string-t))
```

## 阶乘函数

```lisp
(claim-code-metadata function-metadata-t)

(define-metadata factorial
  (arity 1)
  (flags 0)
  (gc-map (struct
            (frame-size 24)
            (callee-saved-count 0)
            (callee-saved-live 0)
            (local-count 3)
            (local-live 7)))
  (name "factorial"))

(define-code factorial
  (block prolog
    (push (reg rbp))
    (mov (reg rbp) (reg rsp))
    (sub (reg rsp) (imm 24))
    (jmp (label body)))
  (block body
    ;; r0 = arg
    (mov (reg-deref (reg rbp) -8) (reg rdi))
    ;; r1 = x_int(1)
    (mov (reg-deref (reg rbp) -16) (imm 9))
    ;; call int-less-or-equal? r0 r1
    (mov (reg rdi) (reg-deref (reg rbp) -8))
    (mov (reg rsi) (reg-deref (reg rbp) -16))
    (call (label int-less-or-equal))
    (mov (reg-deref (reg rbp) -24) (reg rax))
    ;; jump-if-not r2 else
    (cmp (reg rax) (imm 6))          ;; x_false
    (j (cc e) (label else))
    ;; then: return 1
    (mov (reg-deref (reg rbp) -8) (imm 9))
    (jmp (label epilog))
    else
    ;; else: r1 = isub(r0, r1)
    (mov (reg rdi) (reg-deref (reg rbp) -8))
    (mov (reg rsi) (reg-deref (reg rbp) -16))
    (call (label isub))
    (mov (reg-deref (reg rbp) -16) (reg rax))
    ;; r1 = factorial(r1)  -- safepoint
    (mov (reg rdi) (reg-deref (reg rbp) -16))
    (call (label factorial))
    (mov (reg-deref (reg rbp) -16) (reg rax))
    ;; tail-call imul(r0, r1)
    (mov (reg rdi) (reg-deref (reg rbp) -8))
    (mov (reg rsi) (reg-deref (reg rbp) -16))
    (jmp (label epilog)))
  (block epilog
    (add (reg rsp) (imm 24))
    (pop (reg rbp))
    (ret)))
```

## 带嵌套 struct 的数据

```lisp
(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-struct rect-t
  (top-left point-t)
  (bottom-right point-t)
  (color int64-t))

(claim my-rect rect-t)
(define-data my-rect
  (top-left (struct (x 0) (y 0)))
  (bottom-right (struct (x 100) (y 100)))
  (color 0xFF0000))
```

引用嵌套字段：

```lisp
(label-imm (label my-rect bottom-right x))
(label-deref (label my-rect bottom-right x))
```

## 指针字段

```lisp
(define-struct config-t
  (version uint32-t)
  (table (pointer-t entry-t))
  (description string-t))

(claim my-config config-t)
(define-data my-config
  (version 1)
  (table (pointer
          (struct entry-t
            (key "foo")
            (value 42))))
  (description "a config example"))
```

- `(pointer (struct entry-t ...))`：汇编器创建匿名 data slot 存放 `entry-t` 实例，`table` 字段填入指向它的指针（地址 + relocation）。
- `"a config example"`：汇编器创建匿名 data slot 存放字符串，`description` 字段填入指针。

# 后续话题

GC 元数据（safepoint、liveness）和寄存器分配（`var` 的替换 pass）将在后续设计中细化。
