---
title: x-lisp project
date: 2025-10-22
---

# 价值

一个独立自主的语言。

适合用来写新的解释器与编译器，目的是为了探索新的计算模型。比如：

- interaction net
- pi-calculus
- rewrite system
- propagator model
- logic constraint programming

方便用 C 扩展，可以作为 app 的脚本语言：

- uxn 风格的 canvas
- uxn 风格的 flash card app

# 范围

为了独立自主，最终的目标是用 x-lisp 写其自身的编译器。

但是第一阶段可以先用 js/ts 来写编译器。

第一个阶段的 scope 是：

- x-lisp 的解释器
- basic-lisp 中间语言
- x-lisp 到 basic-lisp 的编译器
- C runtime
- basic-lisp 到 x86 的 codegen

第二个阶段可以直接把 js/ts 代码 port 到 x-lisp。

# 项目管理之前已完成的部分

- [x] x-lisp language design
- [x] x-lisp interpreter
- [x] basic-lisp language design
- [x] basic-lisp interpreter (no module system)
  - [x] plugin system

# milestone 0 -- learn EOC

补全为了实现编译器我所已知欠缺的知识。

成果：

- 一个独立于 x-lisp 的，练习性质的编译器。

任务（按照 EOC 的章节划分）：

- [ ] 学会如何编译带有 GC 的语言
- [ ] 学会如何编译 function
- [ ] 学会如何编译 lambda
- [ ] 学会如何处理动态类型编码

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
- 为了简单，不考虑静态类型，只实现纯粹的 dynamic type。

任务：

- [ ] x-lisp compiler (to basic-lisp)
  - [ ] shrink
  - [ ] uniquify
  - [ ] unnest
  - [ ] explicate-control
- [ ] basic-lisp interpreter
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

范围：

- GC 可以只支持 tagged value。

任务：

- [ ] C runtime (with GC)
  - [ ] value tag encoding
  - [ ] builtin
  - [ ] GC
- [ ] basic-lisp codegen (to x86 via GNU assembler)
  - [ ] select instruction
  - [ ] allocate registers

# milestone 4 -- optimization

优化放到最后，具体任务待定。
