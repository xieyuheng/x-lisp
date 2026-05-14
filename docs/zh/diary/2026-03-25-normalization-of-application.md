---
title: normalization of application
date: 2026-03-25
---

直接把 apply 表达式定义为只能接受一个参数的，
会大大简化类型解释器和检查器。
但是这样做，与允许 apply 表达式带有多个参数相比有什么缺点？

可能主要是不方便处理 data-constructor，
也编译 pattern match。

在生成 basic-lisp 代码时也不方便，
需要饱和调用优化（saturated call optimization），
来避免生成很多 closure。

另外，在 inet 和 propagator 中，
缺少参数时的行为不是 currying，
而是构造 graph。

所以我直接处理带有多个参数的 apply 表达式，
而不是使其简化为只能接受一个参数。
