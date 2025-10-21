---
title: x-lisp project
date: 2025-10-22
---

# why do it?

我想要有一个能由我完全控制的语言，
可以实现我需要的语言功能，
并且实验我所感兴趣的，新的语言功能。

我想要有一个合适的语言来写新的解释器与编译器，
写这些东西的目的是为了探索新的计算模型，
比如 interaction net 和 pi-calculus，
又比如 rewrite system 和 propagator model
和 logic constraint programming。

有了 x-lisp 之后，我还可以把它作为
uxn 风格的 game engine 的脚本语言。
或者 uxn 风格的 app 的脚本语言。

# scope

我想要独立自主的语言，
因此最终的目标是用 x-lisp 写其自身的编译器。

但是第一阶段可以先用 js/ts 来写编译器。
因此第一个阶段的代码都是 js/ts 实现的。

第一个阶段的 scope 是：

- x-lisp 的解释器。
- basic-lisp 中间语言。
- x-lisp 到 basic-lisp 的编译器。
- basic-lisp 到 x86 的 codegen，外加一个 C runtime。

第二个阶段可以把 js/ts 代码 port 到 x-lisp。

# work breakdown

- [x] x-lisp language design
- [x] x-lisp interpreter
- [x] basic-lisp interpreter
  - [ ] plugin system
  - [ ] SSA
  - [ ] type inference
  - [ ] module system
  - [ ] bundling
- [ ] x-lisp compiler (to basic-lisp)
  - [ ] uniquify
  - [ ] unnest
- [ ] C runtime (with GC)
  - [ ] builtin
  - [ ] GC
- [ ] basic-lisp codegen (to x86 via GNU assembler)
  - [ ] select instruction
  - [ ] allocate registers
