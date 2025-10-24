---
title: x-lisp project
date: 2025-10-22
---

# 价值

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

# 范围

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

# 项目管理之前已完成的部分

- [x] x-lisp language design
- [x] x-lisp interpreter
- [x] basic-lisp language design
- [x] basic-lisp interpreter (no module system)
  - [x] plugin system

# milestone 1 -- compiler frontend

从 x-lisp 编译到 basic-lisp。

这是最难的部分。
因为这里需要处理与 x-lisp 的特殊 feature 有关的编译问题，
而这些问题可能是需要研究的，
是不能在已有的课程中直接学到的。

成果：

- 在使用 x-lisp 的解释器来运行代码之外，
  有了用 basic-lisp 的解释器来运行代码的能力。

  可以在命令行新增一个命令来区分两种运行模式。

范围：

- 可以先不考虑 module system。

前提：

- [ ] 从 EOC 学会如何编译 function 和 lambda
- [ ] 从 EOC 学会如何处理动态类型

任务：

- [ ] x-lisp compiler (to basic-lisp)
  - [ ] shrink
  - [ ] uniquify
  - [ ] unnest
  - [ ] dynamic type -- use tag and untag operaters
  - [ ] explicate-control
- [ ] basic-lisp interpreter
  - [ ] type inference
  - [ ] dynamic type -- support tag and untag operaters
  - [ ] SSA

# milestone 2 -- module system and bounding

这是补全上一个 milestone 没有完成的任务，
也是为 codegen 做准备。

bounding 问题对于我来说是新问题，
所以也独立开一个 milestone。

成果：

- 这个 milestone 会使得 x-lisp
  可以编译带有 module system 的代码 到 basic-lisp。

任务：

- [ ] basic-lisp interpreter
  - [ ] module system
  - [ ] bundling

# milestone 3 -- codegen

成果：

使得 x-lisp 可以完全脱离 js 的 runtime。
这时我们「独立自主」的目标已经达成了。
写 x-lisp 代码时的感觉完全不一样了。

任务：

- [ ] C runtime (with GC)
  - [ ] value tag encoding
  - [ ] builtin
  - [ ] GC -- must support untagged value
- [ ] basic-lisp codegen (to x86 via GNU assembler)
  - [ ] select instruction
  - [ ] allocate registers

# milestone 4 -- optimization

优化放到最后，具体任务待定。
