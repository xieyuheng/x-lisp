---
title: x-lisp -- project management
date: 2025-12-04
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

分阶段实现：

- 第一个阶段实现 bootstrap compiler。
- 第二个阶段实现 self compiler，
  这个时候可以直接把 js/ts 代码 port 到 x-lisp。

这次项目管理只包含第一阶段。

# 说明

项目管理之前已完成的部分：

- [x] x-lisp language design
- [x] x-lisp interpreter

# 关卡 1 -- x-forth.c

成果：

- 获得一个方便用 c 扩展的类 forth 语言。
- 可以作为 x-lisp 的编译对象。

范围：

- 只实现 imprative programming 功能，
  高级的 functional programming 功能用编译器实现。
- 要带有模块系统，类似 basic-lisp 的生态位。

任务：

- [x] x-forth
  - [x] value encoding
  - [ ] syntex design
  - [ ] vm
  - [ ] garbage collection
  - [ ] builtin structural data
  - [ ] module system
  - [ ] bundling

# 关卡 2 -- x-lisp-forth.js

成果：

- 编译 x-lisp 到 x-forth。

任务：

- [ ] x-lisp-forth
  - [ ] lift-lambda
  - [ ] structural algebraic data type
  - [ ] pattern match
  - [ ] design by contract
