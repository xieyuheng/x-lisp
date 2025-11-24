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

也就是说这个功能需要在 basic-lisp 来实现。
用 `define-cached-value` 这个语法关键词来明显表达。

我们有三层语言 x-lisp -> basic-lisp -> machine-lisp，
这使得我们在解决某个语言功能的实现问题时，多了一个设计的维度。

同时这也要求我们，每当考虑一个语言功能的时候，
要在一个语言层次所构成的整体中考虑。
