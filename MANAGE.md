---
title: x-lisp -- project management
date: 2025-12-04
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

# 关卡 1 -- 作为编译对象的栈虚拟机（用类 forth 语言实现）

成果：

- 获得一个方便用 c 扩展的类 forth 语言。
- 可以作为 x-lisp 的编译对象。

范围：

- 只实现 imprative programming 功能，
  高级的 functional programming 功能用编译器实现。
- 要带有模块系统，类似 basic-lisp 的生态位。
  不像 basic-lisp 一样需要进一步编译，因此不需要 bundling。

任务：

- [x] x-lisp-forth
  - [x] value encoding
  - [x] vm
  - [x] syntex design
  - [x] garbage collection
  - [x] structural datatypes
  - [x] module system

总结 [2026-01-01]：

- 这个关卡从 2026-12-04 开始，到今天结束。
  花费将近一个月，用了太长时间。

- 项目的压力与焦虑来自于未完成的项目。
  因此重要是「快」：

  - 简化方案，快速实现。
  - 接受不完美的设计，不要拖延。

  快速完成项目就能解除压力与焦虑。
  项目的维护和优化是长期的工作，可以慢慢来。
  但是项目的初步完成一定要快。

# 关卡 2 -- 初步将 lisp 编译到 forth

成果：

- 可以利用 x-lisp-forth 来运行 x-lisp 代码。

任务：

- [x] 描述 lisp 语言
- [ ] 描述 forth 语言
- [ ] 将 lisp 的基础部分编译到 forth
  - [x] LiftLambdaPass
  - [ ] ExplicateControlPass

# 关卡 3 -- 将完整的 lisp 编译到 forth

成果：

- 能有用 x-lisp 实现中小型项目。
  - 可以用之前实现的 eoc 做为测试用的项目。

任务：

- [ ] structural algebraic data type
- [ ] pattern match
- [ ] design by contract
