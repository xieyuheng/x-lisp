---
title: garbage collection
date: 2025-11-19
---

马上就要实现 garbage collection 了，总结一下所选的方案。

方案：

- 由于目的之一是可以方便用 c 扩展，
  所以使用最简单的 mark sweep gc。

  - 每个 c 所扩展的 object pointer 都记录在 gc 中。
    可以是一个简单的 pointer 的 array，
    因为有一层间接，所以 object pointer 本身的地址是稳定的。

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
