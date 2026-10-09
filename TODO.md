# meta-lisp.js / meta-lisp.meta

我们之前为 meta-lisp 语言实现了 markdown 支持，
可以直接把 .md 后缀的文件作为源代码文件，
把里面带有 meta-lisp 标记的 code block 作为源代码。

我们的 meta-lisp 模块系统是与文件系统解耦的，
有 fragment 的概念。

之前的设计是：

- 一个 .meta 文件是一个 fragment；
- 一个 .md 文件中的每个 code block 是一个 fragment。

这个设计是错误的。

应该设计为：

- 一个 .meta 文件是一个 fragment；
- 一个 .md 文件是一个 fragment。

这样可以保持简单，
并且一个 .md 文件中的 import 依赖语句，
可以在 code block 之间传递。

先给出方案。

# 文学式编程

文学式编程.md

- 关于读代码与写代码的研究
- 综合学习 assembly 时的笔记。
- 读结构化编程的论文
- 读 knuth 文学式编程的书

# xvm

[xvm.c] review xvm.c 代码

# self-hosting

[meta-lisp.meta] [review] env.meta
[meta-lisp.meta] [review] apply.meta
[meta-lisp.meta] [review] evaluate.meta

[meta-lisp.meta] 110-locate-pass.meta
[meta-lisp.meta] 120-check-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 115-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# 游戏引擎

pico-8 uxn love2d gedot
