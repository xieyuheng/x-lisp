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

只实简单的 dynamic type，所有的 value 都有 tag。

第一个阶段实现 bootstrap compiler：

- x-lisp interpreter
- basic-lisp interpreter
- x-lisp compile to basic-lisp
- C runtime
- basic-lisp codegen to x86

第二个阶段实现 self compiler，
可以直接把 js/ts 代码 port 到 x-lisp。

# 项目管理之前已完成的部分

- [x] x-lisp language design
- [x] x-lisp interpreter
- [x] basic-lisp language design
- [x] basic-lisp interpreter (no module system)
  - [x] plugin system

# milestone 1 -- compiler frontend

从 x-lisp 编译到 basic-lisp。

成果：

- 获得用 basic-lisp 的解释器来运行代码的能力。
- 给命令行新增一个命令来区分两种运行模式。

范围：

- 先实现一个可扩展的 lambda calculus，这是语言的核心部分。
- 先不考虑 module system。
- 先不考虑 SSA，直接生成最可以多次赋值的 basic block。

任务：

- [x] x-lisp compiler (to basic-lisp)
  - [x] shrink
  - [x] uniquify
  - [x] reveal-function
  - [x] lift-lambda
  - [x] unnest-operand
  - [ ] explicate-control

# milestone 2 -- module system and bundling

这是补全上一个 milestone 没有完成的任务，
也是为 codegen 做准备。

难点：

- bundling 问题对于我来说是新问题。

成果：

- 这个 milestone 会使得 x-lisp
  可以编译带有 module system 的代码 到 basic-lisp。

任务：

- [ ] basic-lisp interpreter
  - [ ] module system
  - [ ] bundling

# milestone 3 -- codegen

成果：

- 使得 x-lisp 可以完全脱离 js 的 runtime。
  这时我们「独立自主」的目标已经达成了。

范围：

- GC 可以只支持 tagged value。

任务：

- [ ] C runtime (with GC)
  - [ ] value tag encoding
  - [ ] builtin
  - [ ] GC
- [ ] basic-lisp codegen (to x86 via GNU assembler)
  - [ ] select-instruction
  - [ ] allocate-register

# milestone 待定 -- SSA

SSA 是后续所有 optimization 的前提。

如果不考虑优化，SSA 对于 codegen 来说是可选的。

难点：

- 研究转化 SSA 的各种方式。

成果：

- 将 basic-lisp 转化为 SSA。

任务：

- [ ] basic-lisp interpreter
  - [ ] SSA

# milestone 待定 -- optimization

优化放到最后，具体任务待定。
