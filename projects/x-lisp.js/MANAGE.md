---
title: x-lisp -- project management
date: 2025-01-28
---

# 价值

x-lisp 的首要目标是加快新语言开发的速度。

要适合用来写新的解释器与编译器，
目的是为了探索新的计算模型。

比如：

- interaction net
- pi-calculus
- rewrite system
- propagator model
- logic constraint programming
- reactive programming

之所以能加快新语言开发，假设是：
在 lisp 的语法框架内，可以更快地设计和迭代新语法，
从而加快新语言的开发速度。

次要目标：

- 方便用 C 扩展，可以作为用 C 实现的 library 和 app 的脚本语言。
- 尽量使实现独立，简化所依赖的技术栈。

# 范围

只实现简单的 dynamic type，所有的 value 都有 tag。

分阶段实现：

- 第一个阶段实现 bootstrap compiler。
- 第二个阶段实现 self compiler，
  这个时候可以直接把 js/ts 代码 port 到 x-lisp。

这次项目管理只包含第一阶段。

# 说明

项目管理之前已完成的部分：

- [x] x-lisp language design
- [x] x-lisp interpreter

# 关卡 1 -- 初步将 x-lisp 编译到 basic-lisp

范围：

- 由于我们在这个阶段，
  只需要使所描述的 basic-lisp 语言可以被翻译成 .basic 文件，
  然后由 basic-lisp.c 来执行。
  所以可以只描述，而不解析也不运行。
  不必实现 parse 和 load，
  也不必实现 basic-lisp 的解释器。

任务：

- [x] 描述 lisp 语言
- [x] 描述 basic-lisp 语言
- [x] 将 lisp 的基础部分编译到 basic-lisp
  - [x] LiftLambdaPass
  - [x] UnnestOperandPass
  - [x] ExplicateControlPass

总结 [2026-01-29]：

- 回到了最初的类似 EOC 的编译器。
  也许一开始就应该遵循 EOC 的设计，
  而不是偏离到别的 SSA 类的中间语言。

# 关卡 2 -- 作为编译对象的中间语言

成果：

- 获得一个方便用 c 扩展的，
  专门为动态类型语言设计的中间语言 -- basic-lisp。
- 可以作为 x-lisp 的编译对象。

范围：

- 只实现 imprative programming 功能，
  高级的 functional programming 功能用编译器实现。
- 要带有模块系统。

从 x-forth 继承来的，已完成的部分：

- [x] basic-lisp
  - [x] value encoding
  - [x] garbage collection
  - [x] structural datatypes
  - [x] module system

任务：

- [x] basic-lisp
  - [x] vm
  - [x] sexp parser

总结 [2026-02-08]：

- 继承 x-forth 的 stack-based vm。

# 关卡 3 -- 将完整的 x-lisp 编译到 basic-lisp

成果：

- 能有用 x-lisp 实现中小型项目。
  - 可以用之前实现的 eoc 做为测试用的项目。

任务：

- [x] cond
- [x] define-data
- [ ] claim
- [ ] match
