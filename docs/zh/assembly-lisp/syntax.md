---
title: 语法
---

# 前言

assembly-lisp 是 **x86-64 汇编语言的 Lisp 语法 DSL**。

使用**符号表达式**（S-expression）语法来编写 x86-64 汇编程序。
保留 x86-64 的机器语义（寄存器、寻址模式、指令集），提供 `define-code`、`define-data`、`define-struct` 等结构化抽象。

**值只携带它内在的属性；「如何解释」的语义放到操作上。**

- 指针 opaque——不携带元素类型，纯 8 字节地址。
- struct 的「形状/布局」为偏移计算的依据。
- 类型不附着在指针值上，而是落在「声明」（`define-struct`）与「操作」（`offset-of`）上。

模块顶层由**顶层定义**（definition）组成。
函数由**基本块**（block）组成，基本块由**指令**（instr）组成。

下面分组介绍 assembly-lisp 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
- [类型](#类型)
  - [具名类型](#具名类型)
  - [数组类型](#数组类型)
- [数据](#数据)
  - [整数](#整数)
  - [字符串](#字符串)
  - [(struct)](#struct)
  - [(pointer)](#pointer)
  - [(array)](#array)
  - [符号地址](#符号地址)
- [位移](#位移)
  - [整数位移](#整数位移)
  - [(offset-of)](#offset-of)
- [操作数](#操作数)
  - [(reg)](#reg)
  - [(imm)](#imm)
  - [(label)](#label)
  - [(address)](#address)
  - [(deref)](#deref)
  - [(reg-deref)](#reg-deref)
  - [(cc)](#cc)
  - [(var)](#var)
  - [(external-label)](#external-label)
  - [data-operand](#data-operand)
- [指令](#指令)
  - [指令索引](instructions/index.md)
- [基本块](#基本块)
- [顶层定义](#顶层定义)
  - [(define-code)](#define-code)
  - [(define-data)](#define-data)
  - [(define-metadata)](#define-metadata)
  - [(define-struct)](#define-struct)
  - [(define-space)](#define-space)
- [模块](#模块)
- [汇编过程](#汇编过程)
- [约定](#约定)
  - [-8 slot 与元数据](#-8-slot-与元数据)
  - [序列化与重定位](#序列化与重定位)

# 注释

assembly-lisp 使用 Lisp 风格的行注释，以 `;` 开头直到行尾。通常写两个分号 `;;`。

```scheme
;; 这是一条注释
(mov (reg rax) (imm 42))  ;; 行尾注释
```

# 类型

类型是一个 tagged union——可以是具名类型或定长数组类型。

## 具名类型

内建原始类型：

| 类型        | 大小    | 说明       |
|-------------|---------|------------|
| `pointer-t` | 8 bytes | opaque 指针 |
| `string-t`  | 8 bytes | 等于 `pointer-t`（C 意义的 `const char *`） |
| `int8-t`    | 1 byte  | 有符号 8 位整数  |
| `int16-t`   | 2 bytes | 有符号 16 位整数 |
| `int32-t`   | 4 bytes | 有符号 32 位整数 |
| `int64-t`   | 8 bytes | 有符号 64 位整数 |
| `uint8-t`   | 1 byte  | 无符号 8 位整数  |
| `uint16-t`  | 2 bytes | 无符号 16 位整数 |
| `uint32-t`  | 4 bytes | 无符号 32 位整数 |
| `uint64-t`  | 8 bytes | 无符号 64 位整数 |

- `pointer-t` 是 **opaque** 指针——无 pointee 类型，纯 8 字节地址。
- 用户 struct 类型由 `define-struct` 引入（见「顶层定义」），通过名称引用（如 `point-t`）。类型名必须以 `-t` 结尾。

结构体按 `__attribute__((packed))` 布局——字段间无 padding，每个字段按类型大小依次排列。

## 数组类型

```scheme
(array-t <element-type> <length>)
```

`(array-t <T> <N>)` 是定长数组——`N` 个连续 `<T>` 元素，总大小 = `sizeof(T) * N`。

```scheme
(array-t uint8-t 256)
(array-t int64-t 10)
(array-t pointer-t 8)
```

# 数据

数据（data）描述数据段内存布局——用户在源码中书写的编译期常量形式。

## 整数

```scheme
42
-1
0
```

## 字符串

```scheme
"hello"
""
```

## (struct)

```scheme
(struct <name>
  (<field> <data>)
  ...)
```

例如：

```scheme
(struct point-t
  (x 0)
  (y 0))
```

## (pointer)

```scheme
(pointer <data>)
```

编译期创建匿名 data slot 存放 `<data>`，产出为指向它的指针。

```scheme
(pointer (struct node-t (value 1) (next 0)))
```

## (array)

```scheme
(array <data> ...)
```

例如：

```scheme
(array 1 2 3 4 5)
(array "a" "b" "c")
```

## 符号地址

```scheme
(address <name>)
```

例如：

```scheme
(address factorial)
```

# 位移

`reg-deref` 的位移（displacement）是编译期常量，有两种形态。

## 整数位移

```scheme
8
-8
16
```

直接给出字节数。

## (offset-of)

```scheme
(offset-of <struct-type> <field> ...)
```

沿 `struct-type` 的字段路径逐级累加偏移，求值为字节数。

```scheme
(offset-of point-t y)            ;; point-t 中 y 字段的字节偏移
(offset-of node-a-t next)        ;; node-a-t 中 next 字段的字节偏移
```

- `offset-of` 把「struct 类型 + 字段名 → 偏移」分离成独立的编译期计算。
- **`offset-of` 不穿指针**——它只在单个 struct 内逐字段累加；一旦字段是 `pointer-t`，路径即终止。
- 跨指针的字段访问要靠「`offset-of` + `deref` + `offset-of`」链式组合。

编译期 pass 会将所有 `offset-of` 替换为具体整数位移。

# 操作数

操作数是指令的参数，按 x86-64 机器语义分类。

## (reg)

```scheme
(reg <name>)
```

物理寄存器。

常见寄存器：`rax`、`rbx`、`rcx`、`rdx`、`rsi`、`rdi`、`rbp`、`rsp`、`r8`-`r15`。

```scheme
(reg rax)
(reg r15)
```

## (imm)

```scheme
(imm <value>)
```

立即数。

```scheme
(imm 42)
(imm -1)
```

## (label)

```scheme
(label <name>)
```

代码标号引用——专用于 **rel32** 域（`jmp` / `call` / `j` 的跳转目标）。

```scheme
(label is-greater)
(label merge)
```

`(label ...)` 不能作为指令——标号只能由 `block` 定义。

## (address)

```scheme
(address <name>)
```

符号地址作为 64-bit 立即数（`movabs` + 重定位）。

```scheme
(address origin)
(address chain)
```

## (deref)

```scheme
(deref (address <name>))
```

读取该符号地址处的内容，编码为 `[rip + disp32]`。内部包裹一个 `address-operand`。

```scheme
(deref (address k))
```

## (reg-deref)

```scheme
(reg-deref (reg <base>)
           [(reg <index>)]
           [<scale>]
           [<disp>])
```

寄存器相对寻址，支持完整 SIB。

- `base` / `index`：寄存器名，文本语法写 `(reg ...)`。
- `scale`：可选，仅 `1` / `2` / `4` / `8`。
- `disp`：可选，整数或 `(offset-of ...)`。

```scheme
(reg-deref (reg rbp))                             ;; [rbp]
(reg-deref (reg rbp) -8)                          ;; [rbp - 8]
(reg-deref (reg rbp) (offset-of point-t y))       ;; [rbp + offset]
(reg-deref (reg rbp) (reg rax) 8)                 ;; [rbp + rax*8]
(reg-deref (reg rbp) (reg rax) 8 -16)             ;; [rbp + rax*8 - 16]
```

## (cc)

```scheme
(cc <code>)
```

条件码，仅用于 `j` 指令。

| 代码 | 含义           |
|------|----------------|
| `e`  | equal          |
| `ne` | not equal      |
| `l`  | less           |
| `le` | less or equal  |
| `g`  | greater        |
| `ge` | greater or equal |
| `b`  | below          |
| `be` | below or equal |
| `a`  | above          |
| `ae` | above or equal |

```scheme
(cc e)
(cc l)
```

## (var)

```scheme
(var <name>)
```

寄存器分配前的虚拟变量。

带 `var` 的汇编语言是中间表示；寄存器分配 pass 会把它替换为 `reg` 或 `reg-deref`。

## (external-label)

```scheme
(external-label <name>)
```

外部符号引用（如 libc 函数、syscall 入口），由外部重定位解析。

```scheme
(external-label printf)
```

## data-operand

当操作数位置不匹配任何已知形式时，fallback 解析为 `data-t` 并包装为 `data-operand`。

预编码阶段将 `data-operand` 解析为具体 operand：

| `data` 类型     | 解析为               | 编码               |
|-----------------|----------------------|--------------------|
| 整数            | `imm-operand`        | 立即数             |
| 字符串          | 匿名 data slot + `deref-operand` | `[rip + disp32]` |
| `(pointer ...)` | 匿名 data slot + `deref-operand` | `[rip + disp32]` |
| 裸符号          | `address-operand`    | movabs             |

裸 `(struct ...)` 和 `(array ...)` 不支持——报错。

```scheme
(mov (reg rax) "hello")                           ;; 匿名字符串 → deref
(mov (reg rcx) 42)                                ;; 等价于 (imm 42)
(mov (reg rax) (pointer (struct point-t (x 0) (y 0))))  ;; 匿名 struct + deref
```

当前 **只在 `.exe` 格式下支持**（flat 格式没有独立 data section）。

# 指令

所有指令统一为 op + operands。

```scheme
(<op> <operand> ...)
```

每条指令的语法和操作数约束详见[指令索引](instructions/index.md)。

# 基本块

基本块由标号和指令序列组成。

- `name`：block 名称，即本地标号（跳转目标）。
- 一个函数的第一个 block 是 entry block。
- block 之间忠实 x86 地 **fall-through**：一个 block 执行到末尾若没有 `ret` / `jmp`，控制流顺序流入紧邻的下一个 block。

```scheme
(block entry
  (mov (reg rax) (imm 10))
  (mov (reg rcx) (imm 3))
  (cmp (reg rax) (reg rcx))
  (j (cc g) (label is-greater))
  (mov (reg rax) (imm 0))
  (ret))

(block is-greater
  (mov (reg rax) (imm 1))
  (ret))
```

- 上面 `j (cc g)` 成立则跳到 `is-greater`，不成立则 fall-through 到 `(mov (reg rax) (imm 0))`。

# 顶层定义

## (define-code)

```scheme
(define-code <name>
  <block> ...)
```

定义一个可执行函数。

```scheme
(define-code add1
  (block entry
    (mov (reg rax) (reg-deref (reg rbp) 16))
    (add (reg rax) (imm 1))
    (ret)))
```

## (define-data)

```scheme
(define-data <name> <data>)
```

定义一个具名数据块。`<data>` 是一个 `data-t`，类型由值自描述推断（无 `claim`）。

```scheme
(define-data greeting "hello")

(define-data origin
  (struct point-t
    (x 0)
    (y 0)))

(define-data head
  (pointer
    (struct node-t
      (value 1)
      (next 0))))
```

由于指针 opaque，`(pointer (struct ...))` 的目标 struct **必须具名**。

## (define-metadata)

```scheme
(define-metadata <name>
  <value>)
```

为 `<name>` 这个 label 的 `-8` slot 填充元数据。

`<value>` 典型为 `(pointer (struct <name> ...))`——汇编器创建匿名 struct slot，并在 `<name> - 8` 处填入指向它的指针。

```scheme
(define-struct func-meta-t
  (arity int64-t)
  (name string-t))

(define-metadata my-func
  (pointer
    (struct func-meta-t
      (arity 3)
      (name "triple"))))
```

## (define-struct)

```scheme
(define-struct <name>-t
  (<field-name> <type>)
  ...)
```

声明结构体类型与字段布局。

- 类型名必须以 `-t` 结尾。
- 字段是**有序**的——决定各字段偏移与总大小。
- 布局为 packed——字段间无 padding。

```scheme
(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-struct node-a-t
  (next pointer-t)
  (value int64-t))
```

## (define-space)

```scheme
(define-space <name> <size>)
```

分配未初始化内存（BSS 语义）。

```scheme
(define-space buffer 4096)
(define-space stack 16384)
```

# 模块

模块是所有定义的容器，加上元数据表与匿名数据表。

- `definitions`：所有 `define-code` / `define-data` / `define-struct` / `define-space` 的定义。
- `metadata-definitions`：按 `target` 索引的元数据表（`define-metadata`）。
- `anonymous-data`：`data-operand` 解析时产生的匿名 `data-definition`（含生成的名字如 `©data.0`）。

# 汇编过程

汇编管道：

```
源码
  → parseStmt      → Stmt[]               （解析层）
  → SubmitPass     → Mod                  （提交层）
  → CheckPass      → 类型检查             （检查层）
  → ResolveDisplacements  → offset-of → int-displacement
  → ResolveDataOperands   → data-operand → 具体 operand
  → assembleExe    → bytes
```

- **SubmitPass**：把 `Stmt` 转换为 `Definition` 并注册到 `Mod`。
- **CheckPass**：遍历所有数据定义，推断类型并验证 `data` 与类型匹配。
- **ResolveDisplacements**：把所有 `offset-of` 替换为具体整数位移。
- **ResolveDataOperands**：遍历所有指令，把 `data-operand` 求值并替换为具体 operand。仅 `.exe` 模式运行。
- **assembleExe**：代码布局 + 数据布局 + 重定位 → 最终二进制。

# 约定

## -8 slot 与元数据

每个有 `define-metadata` 的 label 自动在前面（对齐到 8 字节）保留一个 `-8` slot：
`label_addr - 8` 处存放一个 8 字节指针，指向与该 label 关联的元数据 struct 实例。

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

## 序列化与重定位

- 所有 struct 按 packed 布局——字段间无 padding。
- 指针 / 字符串字段先写占位地址，再登记重定位项。Loader mmap 后回填。
- 重定位分四类：
  - **rel32 标号**：`jmp` / `call` / `j` 的相对位移。
  - **内部指针**：data 内部 `(pointer ...)` 的占位 → 匿名 slot 偏移。
  - **数据地址**：裸符号（AddressData）→ 目标 label 地址。
  - **外部符号**：`(external-label ...)` → 外部地址。
