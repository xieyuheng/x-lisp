---
title: revised plan
date: 2025-08-14
---

开始时候的目标是设计一个适合用来写解释器和编译器的语言，
并且写一个其自身的编译器。

这里就有两个选择：

- 编译到真实的机器，比如 x86。
- 编译到虚拟的 vm 的 byte code，比如某种 stack machine。

前者更真实，后者更简单。
目标是前者，但是随时准备后退到后者。

比如说，jai 的 compile time 功能都是用 bytecode 来完成的。
