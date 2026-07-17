---
title: 语法
---

# 前言

assembly-lisp 使用 lisp 语法的汇编语言，支持 x86-64。

特点：

- 值只携带它内在的属性，「如何解释」由操作决定。
- 指针 opaque -- 不携带元素类型，纯 8 字节地址。
- struct 的「形状/布局」为偏移计算的依据。

概念层级：

- definition
  - code-definition
    - block
      - instr
        - operand
  - data-definition
    - data

下面分组介绍 assembly-lisp 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
- [指令](#指令)
- [基本块](#基本块)
- [顶层定义](#顶层定义)
  - [(define-code)](#define-code)
  - [(define-struct)](#define-struct)
  - [(define-data)](#define-data)
  - [(define-space)](#define-space)
- [操作数](#操作数)
  - [(reg)](#reg)
  - [(label)](#label)
  - [(address)](#address)
  - [(deref)](#deref)
  - [(cc)](#cc)
  - [(var)](#var)
  - [(extern)](#extern)
  - [data-operand](#data-operand)
- [类型](#类型)
  - [内置类型](#内置类型)
  - [结构体类型](#结构体类型)
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

# 注释

assembly-lisp 使用 Lisp 风格的行注释，以 `;` 开头直到行尾。通常写两个分号 `;;`。

```scheme
;; 这是一条注释
(mov (reg rax) 42)  ;; 行尾注释
```

# 指令

```scheme
(<op> <operand> ...)
```

所有指令统一为 op + operands。
采用 intel 的操作数顺序，目标操作数在前，源操作数在后。

每条指令的语法和操作数约束详见[指令索引](instructions/index.md)。

# 基本块

```scheme
(block <label>
  <instr>
  ...)
```

基本块由标号和指令序列组成。

- 一个函数的第一个 block 是 entry block。
- 一个 block 执行到末尾若没有 `ret` / `jmp`，
  控制流顺序流入紧邻的下一个 block。

```scheme
(block entry
  (mov (reg rax) 10)
  (mov (reg rcx) 3)
  (cmp (reg rax) (reg rcx))
  (j (cc g) (label is-greater))
  (mov (reg rax) 0)
  (ret))

(block is-greater
  (mov (reg rax) 1)
  (ret))
```

# 顶层定义

## (define-code)

```scheme
(define-code <name>
  <block>
  ...)
```

例如：

```scheme
(define-code add1
  (block entry
    (mov (reg rax) (deref (reg rbp) 16))
    (add (reg rax) 1)
    (ret)))
```

## (define-struct)

```scheme
(define-struct <type-name>
  (<field-name> <type>)
  ...)
```

声明结构体类型与字段布局。

- 类型名按惯例以 `-t` 结尾。
- 字段间无 padding。

```scheme
(define-struct point-t
  (x int64-t)
  (y int64-t))
```

## (define-data)

```scheme
(define-data <name> <data>)
```

例如：

```scheme
(define-data origin
  (struct point-t
    (x 0)
    (y 0)))
```

## (define-space)

```scheme
(define-space <name> <size>)
```

分配未初始化内存。

```scheme
(define-space buffer 4096)
(define-space stack 16384)
```

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

## (label)

```scheme
(label <name>)
```

代码标号引用 -- 专用于 **rel32** 域（`jmp` / `call` / `j` 的跳转目标）。

```scheme
(label is-greater)
(label merge)
```

`(label ...)` 不能作为指令 -- 标号只能由 `block` 定义。

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

**rip-相对寻址**：

```scheme
(deref (address <name>))
```

编码为 `[rip + disp32]`。

```scheme
(deref (address origin))
```

**寄存器相对寻址**：

第一个参数为 `(reg <base>)`，支持完整 SIB。

```scheme
(deref (reg <base>) (reg <index>) <scale> <disp>)
```

- `base`：base 寄存器名。
- `index`：可选，index 寄存器名。
- `scale`：可选，仅 `1` / `2` / `4` / `8`。
- `disp`：可选，整数或 `(offset-of ...)`。

```scheme
(deref (reg rbp))                             ;; [rbp]
(deref (reg rbp) -8)                          ;; [rbp - 8]
(deref (reg rbp) (offset-of point-t y))       ;; [rbp + offset]
(deref (reg rbp) (reg rax) 8)                 ;; [rbp + rax*8]
(deref (reg rbp) (reg rax) 8 -16)             ;; [rbp + rax*8 - 16]
```

## (cc)

```scheme
(cc <code>)
```

条件码，仅用于 `j` 指令。

| 代码 | 含义             |
|------|------------------|
| `e`  | equal            |
| `ne` | not equal        |
| `l`  | less             |
| `le` | less or equal    |
| `g`  | greater          |
| `ge` | greater or equal |
| `b`  | below            |
| `be` | below or equal   |
| `a`  | above            |
| `ae` | above or equal   |

```scheme
(cc e)
(cc l)
```

## (var)

```scheme
(var <name>)
```

寄存器分配前的虚拟变量。

带 `var` 的汇编语言是中间表示；寄存器分配 pass 会把它替换为 `reg` 或 `deref`。

## (extern)

```scheme
(extern <name>)
```

外部符号引用（如 libc 函数、syscall 入口），由外部重定位解析。

```scheme
(extern printf)
```

## 数据

当操作数位置不匹配任何已知形式时，fallback 为 `data-operand`。

预编码阶段将 `data-operand` 解析为具体 operand：

| `data` 类型     | 解析为                           | 编码             |
|-----------------|----------------------------------|------------------|
| 整数            | `imm-operand`                    | 立即数           |
| 字符串          | 匿名 data slot + `deref-operand` | `[rip + disp32]` |
| `(pointer ...)` | 匿名 data slot + `deref-operand` | `[rip + disp32]` |
| 裸符号          | `address-operand`                | movabs           |

裸 `(struct ...)` 和 `(array ...)` 不支持 -- 报错。

```scheme
(mov (reg rax) "hello")                           ;; 匿名字符串 → deref
(mov (reg rcx) 42)                                ;; 立即数
(mov (reg rax) (pointer (struct point-t (x 0) (y 0))))  ;; 匿名 struct + deref
```

当前 **只在 `.exe` 格式下支持**（flat 格式没有独立 data section）。

# 类型

## 内置类型

| 类型        | 大小    | 说明                     |
|-------------|---------|--------------------------|
| `pointer-t` | 8 bytes | opaque 指针              |
| `string-t`  | 8 bytes | 类似 C 的 `const char *` |
| `int8-t`    | 1 byte  | 有符号 8 位整数          |
| `int16-t`   | 2 bytes | 有符号 16 位整数         |
| `int32-t`   | 4 bytes | 有符号 32 位整数         |
| `int64-t`   | 8 bytes | 有符号 64 位整数         |
| `uint8-t`   | 1 byte  | 无符号 8 位整数          |
| `uint16-t`  | 2 bytes | 无符号 16 位整数         |
| `uint32-t`  | 4 bytes | 无符号 32 位整数         |
| `uint64-t`  | 8 bytes | 无符号 64 位整数         |

- `pointer-t` 是 **opaque** 指针 -- 无 pointee 类型，纯 8 字节地址。
- 用户 struct 类型由 `define-struct` 引入（见「顶层定义」），
  通过名称引用（如 `point-t`）。类型名必须以 `-t` 结尾。

## 结构体类型

有 `(define-struct)` 定义。

结构字段间无 padding。

## 数组类型

```scheme
(array-t <element-type> <length>)
```

`(array-t <T> <N>)` 是定长数组 -- `N` 个连续 `<T>` 元素，总大小 = `sizeof(T) * N`。

```scheme
(array-t uint8-t 256)
(array-t int64-t 10)
(array-t pointer-t 8)
```

# 数据

数据（data）描述数据段内存布局 -- 用户在源码中书写的编译期常量形式。

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

`deref` 的位移（displacement）是编译期常量，有两种形态。

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
- **`offset-of` 不穿指针** -- 它只在单个 struct 内逐字段累加；一旦字段是 `pointer-t`，路径即终止。
- 跨指针的字段访问要靠「`offset-of` + `deref` + `offset-of`」链式组合。

编译期 pass 会将所有 `offset-of` 替换为具体整数位移。
