---
title: The ture API of a language
date: 2025-11-19
---

一个语言真正的 API 不是它的语法和 definitional interpreter。
而是它的中间语言和 compiler passes，以及 pass 之间的不变性。

这是比 macro system 和 comptime 等等 API 都更真实的 API。

当人们能够接触到这种 API 时，就会有创新：

- 比如，fil 发现 LLVM 中间语言的特性，
  就可以增加 pass 来实现 memory safe c：
  - https://fil-c.org/how

想要获得这种真实的 API，
就需要中间语言有稳定简单的语法。
比如 basic-lisp 和 machine-lisp。

语言的文档不应该只是介绍语法，
和 definitional interpreter 的行为，
而应该介绍中间语言，
以及每个 pass 是如何实现的。
