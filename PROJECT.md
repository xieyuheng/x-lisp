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
- reactive programming

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
  - [x] explicate-control

总结 [2025-11-06]：

- 完成这个 milestone 大概花了一周时间。
  主要工作是 port EOC 的代码到 js/ts。

- 先实现一个小的核心，也就是 lambda calculus 很重要。
  这让我们能够不怕重头开始写编译器，
  而不是重用 interpreter 的代码。

- 遇到的一个难点是在需要写 explicate-control 的时候，
  basic-lisp 的设计还没完全确定。
  推迟确定设计可以获得更多实践中的信息，
  但是设计和研究的时间是不确定的，
  会让项目用时不确定。

- explicate-control 在处理 if 的时候与 EOC 有区别，
  因为 basic-lisp if 的 condition 只能是 variable。
  这样就没有了 EOC 中那个避免两次 compare 的优化：
  - 一次 compare 返回 bool variable；
  - 一次 compare 选择 branch。
  但是这应该可以在后续 basic-lisp 的优化 pass 中实现。

- desugar 到一个简单的核心语法很重要，
  比如核心语法中没有 `begin` 和 `=`，只有 `let1`。

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
- [ ] x-lisp compiler
  - [ ] module system

# milestone 3 -- machine-lisp

成果：

- 一个 GAS 语法 lisp 化的汇编器。
  代码就是简单的对这个语言的 format。

范围：

- 不考虑扩展，先忠实的翻译 GAS 语法。

任务：

- [ ] machine-lisp
  - [ ] language design
  - [ ] format to GAS

# milestone 4 -- codegen

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
