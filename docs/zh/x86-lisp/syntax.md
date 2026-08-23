---
title: 语法
---

# 前言

x86-lisp 是 x86-64 的 Lisp 语法汇编。

特点：

- 值只携带它内在的属性，「如何解释」由操作决定。
- 指针 opaque -- 不携带元素类型，纯 8 字节地址。
- struct 的「形状/布局」为偏移计算的依据。

概念层级：

- definition
  - code-definition
    - instr
      - operand
  - data-definition
    - data

下面分组介绍 x86-lisp 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
- [指令](#指令)
- [标签](#标签)
- [顶层定义](#顶层定义)
  - [(define-code)](#define-code)
  - [(define-struct)](#define-struct)
  - [(define-data)](#define-data)
  - [(define-space)](#define-space)
- [操作数](#操作数)
  - [(reg)](#reg)
  - [(label)](#label)
  - [(address)](#address)
  - [(mem)](#mem)
  - [浮点字面量](#浮点字面量)
  - [(cc)](#cc)
  - [(var)](#var)
  - [(extern)](#extern)
  - [(relocation)](#relocation)
  - [(label-rel32 中 +4 的含义)](#label-rel32-中-4-的含义)
  - [data-operand](#data-operand)
- [操作数与重定位类型](#操作数与重定位类型)
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

x86-lisp 使用 Lisp 风格的行注释，以 `;` 开头直到行尾。通常写两个分号 `;;`。

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

# 标签

`define-code` 的指令序列中的裸符号（bare symbol）是标签定义。

- 标签只是代码中的一个位置标记，不改变控制流，也不引入新的作用域。
- 控制流按指令顺序流动；若没有 `ret` / `jmp`，会继续执行后面的指令。
- 一个函数的入口就是第一个可执行指令，不需要显式的入口标记。

```scheme
(define-code main
  (mov (reg rax) 10)
  (mov (reg rcx) 3)
  (cmp (reg rax) (reg rcx))
  (j (cc g) (label is-greater))
  (mov (reg rax) 0)
  (ret)
  is-greater
  (mov (reg rax) 1)
  (ret))
```

# 顶层定义

## (define-code)

```scheme
(define-code <name>
  <instr-or-label>
  ...)
```

`<instr-or-label>` 是一条指令，或一个裸符号标签定义。

例如：

```scheme
(define-code add1
  (mov (reg rax) (mem (reg rbp) 16))
  (add (reg rax) 1)
  (ret))
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

代码标签引用 -- 专用于 **rel32** 域（`jmp` / `call` / `j` 的跳转目标）。

```scheme
(label is-greater)
(label merge)
```

注意 `(label ...)` 是 operand，与指令中的地址标签 symbol 不同。

## (address)

```scheme
(address <name>)
```

符号地址作为 64-bit 立即数（`movabs` + 重定位）。

```scheme
(address origin)
(address chain)
```

## (mem)

内存操作数。**size**（`byte` / `word` / `dword` / `qword`，对应 1 / 2 / 4 / 8 字节）
是可选的首参数：

```scheme
(mem <size> <address-or-reg …>)
```

- 省略 size 时由配对的操作数推断（如 `(mov (reg al) (mem …))` 中 `al` 推断 1 字节）；
  与立即数配对时**必须**显式 size（如 `(cmp (mem byte …) 0x61)`）。
- 显式 size 与配对寄存器 size 不一致时，check pass 报错。

**rip-相对寻址**：

```scheme
(mem (address <name>))
(mem byte (address <name>))
```

编码为 `[rip + disp32]`。

```scheme
(mem (address origin))
(mem byte (address buffer))
```

**寄存器相对寻址**：

第一个参数（size 之后）为 `(reg <base>)`，支持完整 SIB。

```scheme
(mem (reg <base>) (<index> | (* <index> <scale>)) [<disp>])
(mem dword (reg <base>) -8)
```

- `base`：base 寄存器名。
- `index`：可选，index 寄存器名，写作 `(reg <name>)`。
- `scale`：可选，仅 `1` / `2` / `4` / `8`，与 index 一起写作 `(* (reg <name>) <scale>)`。
  省略 `(* ...)` 时 scale 默认 `1`。
- `disp`：可选，整数或 `(offset-of ...)`。

```scheme
(mem (reg rbp))                             ;; [rbp]
(mem (reg rbp) -8)                          ;; [rbp - 8]
(mem dword (reg rbp) -8)                    ;; [rbp - 8] dword
(mem (reg rbp) (offset-of point-t y))       ;; [rbp + offset]
(mem (reg rbp) (reg rax))                   ;; [rbp + rax]
(mem (reg rbp) (reg rax) -16)               ;; [rbp + rax - 16]
(mem (reg rbp) (* (reg rax) 8))             ;; [rbp + rax*8]
(mem (reg rbp) (* (reg rax) 8) -16)         ;; [rbp + rax*8 - 16]
```

## 浮点字面量

操作数位置的浮点字面量（如 `3.14`）编码为 double 的 **raw 64 位 IEEE-754 位模式**
立即数（8 字节 movabs）。它是未打 tag 的常数——需要 tagged 值时配合 `and`/`or`
的 tag 位操作（对应编译器 `float64` → `tag-float` 的输出模式）。

```scheme
(mov (reg rax) 3.14)                  ;; movabs rax, 0x40091EB851EB851F
(mov (mem qword (reg rbp) -8) 3.14)   ;; movabs rax, bits; mov [rbp-8], rax
```

- 目标为 `mem` 时必须显式标注 `qword`（浮点字面量本身不带 size 信息）。

## (cc)

```scheme
(cc <code>)
```

条件码，用作 `j` 指令的 operand。

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

带 `var` 的汇编语言是中间表示；寄存器分配 pass 会把它替换为 `reg` 或 `mem`。

## (extern)

```scheme
(extern <name>)
```

外部符号引用（如 libc 函数、syscall 入口），由外部重定位解析。

```scheme
(extern printf)
```

## (relocation)

```scheme
(relocation <type> <name>)
```

重定位 operand，在指令中留下回填空间，
并在 relocation table 中记录 relocation entry。

`type` 决定 loader 的回填方式。

| type           | hole 大小 | loader 操作                         |
|----------------|-----------|-------------------------------------|
| `label-rel32`  | 32-bit    | `target + addend - (base + offset)` |
| `label-abs64`  | 64-bit    | `target + addend`                   |
| `extern`       | 64-bit    | symbol 绝对地址                     |
| `symbol-value` | 64-bit    | loader 计算 symbol -> tagged value  |
| 其他自定义     | 64-bit    | 由 loader 解释                      |

```scheme
(mov (reg rax) (relocation symbol-value foo))
```

### (label-rel32 中 addend 的含义)

`label-rel32` 告诉 loader 在 32-bit 字段写入**相对位移**。
x86-64 中所有使用相对寻址的指令，位移是相对于**下一条指令的地址**
（即 RIP 在当前指令执行时的值）：

```
call rel32          → rip = 下一条指令
jmp rel32           → 同上
jcc rel32           → 同上
mov r, [rip+disp32] → 同上
lea r, [rip+disp32] → 同上
cmp r/m, imm        → 同上
```

位移字段（hole）不一定是指令的最后一个字段 —— 如
`cmp byte [buffer], 61h` 中 disp32 之后还有 imm8。
relocation entry 的 `segmentOffset` 指向位移字段的**起始位置**，
`addend` 由汇编器在生成指令时算出 `addend = -(rip - segmentOffset)`，
即「下一条指令相对位移起点的偏移」的相反数：

```
┌────────────────────────── instruction ──────────────────────────┐
│  opcode  │  ModR/M  │  displacement (4 bytes) │  immediate      │
│                        ↑                      └────┐            │
│                   segmentOffset                    └─ rip       │
│                        ├──────── 4 + imm ────────┤              │
└─────────────────────────────────────────────────────────────────┘
```

因此 loader 写入 `target + addend - (base + segmentOffset)`。

- 位移是最后一个字段时（如 `call rel32`、`mov [rip+disp32]`），
  `addend = -4`。
- 位移后还有立即数时（如 `cmp byte [buffer], imm8`），
  `addend = -(4 + imm_size)`。

汇编器（而非 loader）负责把「指令布局」编码进 addend —— loader 只需执行
统一的公式 `S + A - P`，完全不需要知道指令结构。

## 数据

当操作数位置不匹配任何已知形式时，fallback 为 `data-operand`。

预编码阶段将 `data-operand` 解析为具体 operand：

| `data` 类型     | 解析为                           | 编码             |
|-----------------|----------------------------------|------------------|
| 整数            | `imm-operand`                    | 立即数           |
| 字符串          | 匿名 data slot + `mem-operand`   | `[rip + disp32]` |
| `(pointer ...)` | 匿名 data slot + `mem-operand`   | `[rip + disp32]` |
| 裸符号          | `address-operand`                | movabs           |

裸 `(struct ...)` 和 `(array ...)` 不支持 -- 报错。

```scheme
(mov (reg rax) "hello")                           ;; 匿名字符串 → mem
(mov (reg rcx) 42)                                ;; 立即数
(mov (reg rax) (pointer (struct point-t (x 0) (y 0))))  ;; 匿名 struct + mem
```

当前 **只在 `.x86.exe` 格式下支持**（flat 格式没有独立 data section）。

# 操作数与重定位类型

汇编器在生成 `.x86.exe` 时，以下 operand 自动产生 relocation table 条目。

### Code 段

| operand               | 指令                 | 编码              | reloc type    | segment |
|-----------------------|----------------------|-------------------|---------------|---------|
| `(label X)`           | `call` / `jmp` / `j` | `opcode + disp32` | `label-rel32` | CODE    |
| `(address X)`         | `mov` / `lea`        | `[rip + disp32]`  | `label-rel32` | CODE    |
| `(mem (address X))`  | `mov`                | `[rip + disp32]`  | `label-rel32` | CODE    |
| `(extern X)`          | `mov`                | `movabs imm64`    | `extern`      | CODE    |
| `(relocation T X)`    | `mov`                | `movabs imm64`    | `T`           | CODE    |

`(label X)`、`(address X)` 和 `(mem (address X))` 在语义上等价于
`(relocation label-rel32 X)`。

`(extern X)` 等价于 `(relocation extern X)`。

### Data 段

| 数据形式                   | reloc type    | segment |
|----------------------------|---------------|---------|
| `(address X)` 字段         | `label-abs64` | DATA    |
| `(pointer ...)` 字段       | `label-abs64` | DATA    |
| string 作为 pointer-t 字段 | `label-abs64` | DATA    |

data 段中的 `(address X)` 等价于 `(relocation label-abs64 X)`。
pointer 和 string 字段的目标（匿名的 data slot）由汇编器自动分配名称
并记录为 label table 的 DATA 条目。

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

支持十进制、十六进制（`0x`）、二进制（`0b`）、八进制（`0o`）前缀，可带符号：

```scheme
42
-1
0x61
0x7a
-0x20
0b101
0o17
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

`mem` 的位移（displacement）是编译期常量，有两种形态。

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
- 跨指针的字段访问要靠「`offset-of` + `mem` + `offset-of`」链式组合。

编译期 pass 会将所有 `offset-of` 替换为具体整数位移。
