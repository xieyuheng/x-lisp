---
title: garbage collection
date: 2025-11-19
---

# garbage collection

马上就要实现 garbage collection 了，总结一下所选的方案。

方案：

- 由于目的之一是可以方便用 c 扩展，
  所以使用最简单的 mark-sweep gc。

  - 每个 c 所扩展的 object pointer 都记录在 gc space 中。
    可以是一个简单的 pointer 的 array，
    因为有一层间接，所以 object pointer 本身的地址是稳定的。

    - 每个 object pointer 都应该有一个到 gc space 中的 pointer，
      记录自己在 space 中的位置，也就是双向连接。
      space 的位置中，pointer 还保存 mark-sweep 所用到的 mark。

- 使用 shadow stack。
  每次 spill local variable 的时候，都放到 shadow stack 中。
  shadow stack 就是 GC 的 root stack。

  - 前提：是所有 value 都有 tag。

  - 限制：只有在 call stack 中没有 primitive function 时，GC 才是安全的。

- 在编译时插入 gc 函数。
  有 gc safe point 的概念。

  - 可以插入在 data constructor 一类的 primitive function 之前，
    比如 `make-curry` 和 `make-tael`。

  - 在汇编中调用 gc，而不是在 primitive function 中调用 gc。
    这样可以保证能够 call stack 中没有 primitive function。

- 调用 gc 函数之前，callee saved register 中可能有 root。
  需要保存所有 register 到 shadow stack 中。

  - 可以尝试在 gc 函数内用 inline assembly 完成。

  - 如果不行，就需要拆分判断 gc 的函数和进行 gc 的函数，
    然后在生成汇编代码时，先判断是否需要 gc，
    如果需要，再保存寄存器，然后调用 gc。

# reference counting

[2025-11-20]

读了很多论文之后：

- 2001-constant-time-root-scanning-for-deterministic-garbage-collection.md
- 1984-reference-count-garbage-collection.md
- 2002-accurate-garbage-collection-in-an-uncooperative-environment.md
- 2009-accurate-garbage-collection-in-uncooperative-environments-revisited.md

我决定用 1984-reference-count-garbage-collection.md 的方案。

也就是纯运行时的方案。

因为我觉得 GC 的 root scanning 问题，
对于带有 GC 但是没有静态类型系统的语言而言，
root scanning 问题太难了，还是用 VM 实现比较好。

但是这也不太对。
因为每个 assignment 都潜在地需要 reference counting：

- const instruction：
  可以根据 value 的类型决定是否需要 reference counting。

- call 和 apply instruction：
  每次返回值，都要在运行时检查是否需要 reference counting。

  - primitive function  的 call，
    有时可以确定返回值是否是 object。
