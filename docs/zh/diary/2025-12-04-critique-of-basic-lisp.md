---
title: critique of basic-lisp
date: 2025-12-04
---

# 关于动态类型语言

通过 basic-lisp 这个中间语言来实现动态类型语言的编译器，
这件事感觉不太合理，因为在 basic-lisp 中完全没有类型信息，
而 basic-lisp 的职责是优化，类型信息对于优化来说至关重要。

没有明显地把对 tag 的处理在 basic-lisp 中表示出来，
因此 basic-lisp 要求每个 value 都是 tagged value。
这反而使 basic-lisp 作为 IR 的设计变得复杂。
比如目前要求所有 builtin 函数都带有 `x_` 前缀，
builtin 只能接受 tagged value 作为参数，
并且必须返回一个 tagged value。

# 关于限制 operand 为 variable name

看了一些文章说 operand 最好被限制为 variable name，
就盲目跟风了，也不知道这样做有什么好。
导致生成的 basic-lisp 代码看起来非常难看。
