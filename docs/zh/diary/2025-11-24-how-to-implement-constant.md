---
title: how to implement constant
date: 2025-11-24
---

# 方案

假设要把 `(define <name> <exp>)` 实现为 constant。

方案 A：

- 编译成 variable + 初始化代码。

方案 B：

- 编译成带有 memorization nullary 函数。

假设我们允许 module 之间的任意相互引用。
方案 A 就是不可行的，因为没法保证初始化代码的顺序。

这样就只能用方案 B。
方案 B 的缺点是每次 reference constant，
都需要一个判断对是是否已经 memorize 的判断。
只能接受这个 overhead。

# 实现

我们有三层语言 x-lisp -> basic-lisp -> machine-lisp，
这使得我们在解决某个语言功能的实现问题时，多了一个设计的维度。

同时这也要求我们，每当考虑一个语言功能的时候，
要在一个语言层次所构成的整体中考虑。

实现计划：

- 给 basic-lisp 增加 `define-variable` 功能。

- 在 x-lisp 的编译器中把 `(define <name> <body>)` 翻译成函数，
  把对如此定义的 name 的引用翻译成函数调用。

- 给 basic-lisp 的 bundle 增加 setup 功能，
  每个 module 都可以有多段 setup 代码。
  bundle 的时候 merge 所有 module 的 setup 代码。
  假设 setup 代码没有相互依赖。

- 在 x-lisp 中编译函数到为：

  - 一个 `define-variable` -- apply 用到（需要 setup）。
  - 一个 `define-function` -- call 用到。
