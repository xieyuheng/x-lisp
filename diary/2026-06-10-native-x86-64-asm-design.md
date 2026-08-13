---
title: native x86-64 汇编语言设计
authors: [xieyuheng, deepseek]
date: 2026-06-10
---

# 前言

本文在 2026-05-22 的设计文档（native x86-64 compilation with precise GC）基础上，
设计一套使用 Lisp 语法框架的 x86-64 汇编语言。

目标：

- 零外部依赖——不依赖 GNU as、NASM 等
- 生成「native code blob + metadata」数据结构
- 汇编器用 TypeScript 实现（[meta-lisp.js] 内）
- 汇编语言是 meta-lisp 编译器后端（代码生成 + 寄存器分配）的 target IR
- 二进制布局与 C `__attribute__((packed))` struct 兼容

# 顶层形式

## 数据定义的正交模型

`define-data` 与 `define-metadata` 统一为「**claim 类型 + 单个 value**」：

```lisp
(claim <name> <type>)
(define-data <name> <value>)     ;; 或 (define-metadata <name> <value>)
```

- `<value>` 只有一种统一语法（见「操作数」一节）：字面量、字符串、`(struct ...)`、`(pointer ...)`。
- struct 不是顶层语法的特例——顶层和嵌套都用同一个 `(struct ...)`，因此「顶层字段列表」与「嵌套 struct 字面量」不再是两套写法。
- `define-metadata` 只是对 `<name> - 8` slot 做 `define-data` 的语法糖，无独立 emit 路径。

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
(define-data <name> <value>)
```

- `claim` 声明 `<name>` 的类型——可以是任意 sized 类型（原始类型、`string-t`、`(pointer-t <T>)` 或 `define-struct` 类型）。
- `define-data` 给出**单个** value，其类型由 `claim` 决定。
- `<value>` 使用统一的 value 语法（见「操作数」一节）：字面量、字符串、`(struct ...)`、`(pointer ...)`。
- struct 不再是顶层语法的特例——需要 struct 时显式写 `(struct ...)`：

```lisp
;; 标量常量
(claim answer int64-t)
(define-data answer 42)

;; 字符串常量
(claim greeting string-t)
(define-data greeting "hello")

;; struct 常量
(claim origin point-t)
(define-data origin
  (struct
    (x 0)
    (y 0)))

;; 指针常量（匿名 slot + 指针）
(claim head (pointer-t node-t))
(define-data head
  (pointer
    (struct
      (value 1)
      (next 0))))
```

## `(define-metadata)`

为指定 label 的 `-8` slot 填充元数据。

语法与 `define-data` 一致：

```lisp
(define-metadata <name> <value>)
```

- `<name>` 对应一个 `define-code` 或其他顶层 label。
- 由于 `-8` slot 是 8-byte 指针，`<value>` 典型写法是 `(pointer (struct ...))`——汇编器创建匿名 struct slot 并在 `-8` 处填入指向它的指针。
- 语义上 `define-metadata` 等价于对 `<name> - 8` 这个 slot 做一次 `define-data`，因此走与 `(pointer ...)` 相同的「匿名 slot + 重定位」机制，无需独立的 emit 路径。
- **C 侧 ABI 不变**：`-8` 处仍是指针、目标仍是 struct 实例，loader 无需改动。

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

## `(label <name>)`

代码控制流标号的**引用**，按机器语义专用于 **rel32** 域。

标号**只由 block 定义**——每个 `(block <name> ...)` 的名字就是一个标号。`(label <name>)` 本身不定义标号，只在 `jmp` / `call` / `j` 的操作数位置**引用**一个标号，汇编器编码为相对位移：

```lisp
(jmp (label loop))
(call (label helper))
(j (cc e) (label else))
```

- `<name>` 必须是某个 `block` 的名字（本地标号），或一个 `define-code` 函数名。
- **不存在「`(label …)` 作为指令」的写法**——要新增一个跳转目标，就新建一个 `block`（汇编器对 `(label …)` 作指令会报错）。
- `label` 不带字段路径、也不用于取地址；那是 `address` 的职责。

### fall-through

block 之间忠实 x86 地 **fall-through**：一个 block 执行到末尾若没有 `ret` / `jmp`，控制流顺序流入紧邻的下一个 block。`j cc` 是 x86 的单目标条件跳转——条件成立跳到目标，**不成立则 fall-through** 到下一条指令 / 下一个 block。因此 `j cc` 不是完整的 terminator，不必（也不应）强行配一个 `jmp` 把它伪装成双目标分支。

## `(address <name> [<subfield> ...])`

数据地址值——某符号（及可选嵌套字段路径）的地址，按机器语义属于**绝对地址 / RIP 相对**域。`address` 本身即「地址作为 64-bit 立即数」：汇编器生成 `movabs` 编码 + 重定位项。

```lisp
(address factorial)                       ;; 函数地址作立即数
(address my-rect bottom-right x)          ;; 嵌套字段地址作立即数
```

要读取该地址指向的内容，用 `deref` 包裹——汇编器编码为 `[rip + disp32]`：

```lisp
(deref (address some-constant))
(deref (address my-rect bottom-right x))
```

同一符号在两个域的用法对比（如函数 `factorial`）：

```lisp
(call (label factorial))                  ;; 控制流，rel32
(mov (reg rax) (address factorial))       ;; 取其地址作立即数，movabs
(mov (reg rax) (deref (address k)))        ;; 读 k 的内容，[rip + disp32]
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

struct 字面量。可出现在 `define-data` / `define-metadata` 的**顶层 value**位置，也可作为另一个 struct 的字段值（嵌套）。

```lisp
;; 带类型名
(struct point-t (x 0) (y 0))

;; 省略类型名（当 claim 已声明字段类型时）
(struct (x 0) (y 0))
```

## `(pointer <value>)`

在 `(pointer-t <T>)` 类型位置（`define-data` / `define-metadata` 的顶层 value，或某个 struct 的指针字段），
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
(mov (reg rax) (address factorial))
(mov (reg rax) (deref (address constant)))
(mov (reg rax) (reg-deref (reg rbp) -8))
(mov (reg-deref (reg rbp) -8) (reg rax))
(mov (reg-deref (reg rbp) -8) (imm 42))
(mov (reg-deref (reg rbp) -8) (address factorial))
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
(define-metadata factorial
  (pointer
    (struct
      (arity 1)
      (flags 0)
      (gc-map (struct
                (frame-size 24)
                (callee-saved-count 0)
                (callee-saved-live 0)
                (local-count 3)
                (local-live 7)))
      (name "factorial"))))

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
    (jmp (label epilog)))
  (block else
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
  (struct
    (top-left (struct (x 0) (y 0)))
    (bottom-right (struct (x 100) (y 100)))
    (color 0xFF0000)))
```

引用嵌套字段：

```lisp
(address my-rect bottom-right x)            ;; 字段地址作立即数
(deref (address my-rect bottom-right x))    ;; 读字段内容
```

## 指针字段

```lisp
(define-struct config-t
  (version uint32-t)
  (table (pointer-t entry-t))
  (description string-t))

(claim my-config config-t)
(define-data my-config
  (struct
    (version 1)
    (table (pointer
            (struct entry-t
              (key "foo")
              (value 42))))
    (description "a config example")))
```

- `(pointer (struct entry-t ...))`：汇编器创建匿名 data slot 存放 `entry-t` 实例，`table` 字段填入指向它的指针（地址 + relocation）。
- `"a config example"`：汇编器创建匿名 data slot 存放字符串，`description` 字段填入指针。

# 后续话题

GC 元数据（safepoint、liveness）和寄存器分配（`var` 的替换 pass）将在后续设计中细化。
