---
title: compiling x-lisp
date: 2025-10-30
---

# 编译 lambda

编译 lambda 的方式和处理 currying 的方式是类似的，
都可以使用 curried-value。

currying 是 apply 的时候参数不够就返回 curried-value。

lambda 是把所有的函数内的 lambda 都提到函数外，
成为全局函数，这个过程是递归的。
然后把原来 lambda 的位置翻译成一个 curried-value。

runtime 中有用 c 实现的 overloaded apply 函数，
可以处理 curried-value 和 function。

在 basic-lisp 生成代码时，
如果发现 apply 的 target 是 constant，
可以根据具体的 constant 类型以及 arity，
来生成更具体的代码，避免运行时调用一般的 apply。

# 编译 primitive

比如，如果发现 target 是 primitive，
就可以生成对 runtime primitive function 的调用，
如果发现是对应于 instruction 的 primitive，
就可以直接生成 instruction。

也就是说，所编译的就是 lambda calculus，
通过 apply 不同的 target 来扩展 lambda calculus。

# 保持简单

也就是说，这里的原则是：
任何 codegen 上不确定的东西，
都可以用 runtime 中的 c 函数来实现。

甚至 pattern match 也可以。
当然这是效率非常低的。

其实作为第一个编译器，
我需要的只是编译到 C 的 calling convention。
只要让语言可以用 C 扩展就可以。

# 行动

先设计核心的 passes，
把 lambda calculus 编译到 basic-lisp，
外加 define 和 conditional 功能。

把整个编译流程跑起来。

然后再将所编译的对象扩展到整个 x-lisp。

> A flower in nature is not built step by step,
> it grows from a center and unfolds itself
> as a whole to it's full form.

lambda calculus is the center.
lambda calculus is the core.

# 反思 EOC 课程设计

我觉得这也是为什么 EOC 的课程感觉不太对。
EOC 虽然是渐进地从一个具有完整流程的编译器开始的，
但是所编译的对象语言不是从 core 展开的。

到课程的中后期，才讲到 lambda conversion，
在讲解的时候，老师也说，这是这个课程的核心。

但是很遗憾，课程没有从核心开始。

开始的时候，没有 GC，所以按照 EOC 的设计，
很难从 lambda calculus 开始编译。
但是如果区分 frontend 和 backend，
就可以在 frontend 从 lambda calculus 开始，中间语言可以先解释运行。
而到 backend 的时候，核心问题就是 GC 了。
