---
title: machine-lisp
date: 2025-11-06
---

# 动机

很快就要实现代码生成了，
和设计 basic-lisp 的初衷一样，
我也需要专门为代码生成设计一个更接近汇编语言的 lisp，
也就是 machine-lisp。

# (define-code)

汇编语言的本质是 layout bytes，
同时要支持用 label 给某段代码命名。
因此基础语法设计如下：

```scheme
(define-code <label>
  <directive>
  ...)
```

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

TODO 设计 bit pattern 语法。

TODO 设计 byte pattern 语法。
