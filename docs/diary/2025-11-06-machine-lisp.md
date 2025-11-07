---
title: machine-lisp
date: 2025-11-06
---

# 动机

很快就要实现代码生成了，
和设计 basic-lisp 的初衷一样，
我也需要专门为代码生成设计一个更接近汇编语言的 lisp，
也就是 machine-lisp。

# 范围

由于现在 x-lisp 还没完全独立，
所以先不考虑用 x-lisp 扩展 machine-lisp。

machine-lisp 因此没有 macro 功能，
所有的语法扩展都暂时用 JS/TS 实现。

这与 basic-lisp 的情况相同。

# 语法

汇编语言的本质是 layout bytes，
同时要支持用 label 给某段代码命名。

但是还是要有函数的概念，
函数内的 label 以函数为 scope，
通过自动以函数 name 为前缀来实现 scope。

```scheme
(define-function <name>
  (block <label>
    <directive>
    ...)
  ...)
```

另外还要能在函数之外定义数据：

```scheme
(define-data <label>
  <directive>
  ...)
```

但是也许 data 也需要 scope，因为可以考虑统一的：

```scheme
(define-code <name>
  (block <label>
    <directive>
    ...)
  ...)
```

machine-lisp 应该可以成为一个一般的工具，可以用于反汇编。

比如：

- 从只有 `define-block` 的代码，
  通过计算图的联通分支，
  解析出来 control flow graph。

# data directive

directive 首先要考虑最基本的 bytes layout：

| directive | meaning            |
|-----------|--------------------|
| db        | define byte        |
| dw        | define word        |
| dd        | define double word |
| dq        | define quad word   |

注意，具体有 opcode 的东西才叫做 instruction，
因此 db dw dd dq 这些东西称作 directive。

每个 data directive 都有带有进位制后缀的版本，
当然，默认是 dec：

```scheme
(db-hex 41 42 43)
(db-dec 65 66 67)
(db-oct 101 102 103)
(db-bin 101010 101011)
```

# 进制 vs 类型 vs 格式

**进制：**

在 x-lisp 中考虑过 `@hex` 语法，
是说内部的 symbol 要被解释为 hex 数字。

最好能像 uxn 一样，每次出现 4f 之类的 symbol，
就假设是 hex 而不是 dec，不用写 0x4f 或者 4fh。
这相当于是为了最常用的场景优化语法。

uxn 就因为如此，导致整个生态系统的所有的计数方式都是 16 进制的。
这也不一定对，因为人类习惯十进制是大自然进化的结果。

**类型：**

类似 C 的数据类型：

```scheme
(int8 -42)
(uint8 200)
(int16 -1000)
(uint16 50000)
(float32 3.14)
(float64 2.718)
```

或者 rust 的数据类型：

```scheme
(i8 -42)
(u8 200)
(i16 -1000)
(u16 50000)
(f32 3.14)
(f64 2.718)
```

描述的是单个值的类型：

- 与进制不同，不考虑值的表示方式；
- 与下面要讨论的格式也不同。

**格式：**

或者说 layout 格式，

比如 `dq`，不限制 symbol 的格式的，
也不描述数据的类型。

- 毕竟，汇编语言是没有类型的，
  用同样的方式对 int64 和 uint64 进行计算，
  想要把结果解释为不同类型，
  需要看计算之后的 flag。

layout 格式所描述的是一个 sequence 的数据，
都要以某种方式 format。

- 这对于 little endian 来说很重要。

- 对于 big endian 来说也是需要的，
  因为这相当于是对 sequence 的 format，
  需要 padding。

在设计汇编语言时，我们最关心的是 layout format 这个维度的语义。

# 编码和解码

想要编码和解码 instruction，
需要语言能够描述 bit pattern。

想要编码和解码 elf 格式，
需要语言能够描述 byte pattern。

一般的，任何二进制格式的编码和解码都需要这两个功能。

好像这个功能就是 C 的 struct 语法。

但是这与现在 x-lisp 已有的谓词系统不同，
因为谓词的职责是单一的，没法用来描述格式。

这也与未来想要实现的 meta-lisp 中的类型不同，
因为类型系统假设了每个 object 类型都是指针。

指针类型的定义可以递归，
byte pattern 好像也需要指针，
比如可以描述整个 heap 的 dump。

我可以先尝试在 JS/TS 中实现 DLS 来解析二进制文件。
以 ELF 为主要例子，目的是让汇编器能够生成 ELF object file。

# 行动

第一个阶段，可以使用系统汇编器，
就是直接把 gas 的语法 lisp 化。

但是在这个 lisp 化的过程中要保持 machine-lisp 的语言设计，
只不过这个阶段 instruction 都是写死的，而不扩展的。
