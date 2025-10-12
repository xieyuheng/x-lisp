---
title: basic lisp
date: 2025-10-06
---

# 改变实现计划

开启一个 basic-lisp 项目，来帮助 x-lisp 走向独立自主。

在印第安纳大学的编译器课程的基础上，
又发现了康奈尔大学关于编译器优化的课程，
我感觉编译器的实现又简单了一个数量级。
因为这个课程中所设计的中间语言非常简洁且通用。

其简洁性使得扩展这个中间语言的方式只有增加 data type 和 operator。
正如扩展 lisp 的方式是 overload application。
这种局限使得设计方向变得明确。

目前 x-lisp 的实现计划：

- 用 js 写 x-lisp 的解释器。
- 用 x-lisp 写 x-lisp 的编译器，编译到 x86。

改进后 x-lisp 的实现计划：

- 用 js 写 x-lisp 的解释器和编译器，编译器到 basic-lisp。
- basic-lisp 代码可以暂时由 basic-lisp 解释运行。
  basic-lisp 的这个解释器可以用 c 写，以保证运行速度。
- 用 x-lisp 写 x-lisp 的编译器，编译到 basic-lisp。

这样的好处是：

- 我们可以尽早脱离 js 的 runtime，新的 runtime 是 basic-lisp。
- 用 x-lisp 写自身的编译器时，就是简单的 port 已有的用 js 写的编译器代码。

# 具体计划

由于 js 写的 x-lisp 编译器要编译到 basic-lisp，
所以 basic-lisp 要在 js 中有所表示，
因此可以先写一个 js 版本的 basic-lisp。
然后再 port 到 c。

basic-lisp 应该放在这个 repo 内。
因此顶层应该区分 x-lisp 和 basic-lisp 代码，
`src/` 中的 `lang/` 也应该改名为 `x-lisp/`，
并且新增 `basic-lisp/`。

写完 js 版本的 basic-lisp，
就可以跟康奈尔大学的课程了。
