---
title: compiling to forth
date: 2025-11-27
---

相比于 compiling to native code，
compiling to forth 也能形成独立可控的语言实现：

- 用 c 实现 x-forth 解释器。

- x-lisp 直接编译到 x-forth。
  x-forth 大概代替 basic-lisp 的位置。

这种实现方式的好处是：

- x-forth 可移植。

- 可以和未来的编译器 runtime 重用一部分代码：

  - value encoding
  - primitive-function
  - GC
