---
title: design basic-lisp
date: 2025-10-15
---

直接描述 block 而不是从 instruction list 生成 block。

问题 1：

是否像 bril 一样，限制所有的 operand 都是 variable？
bril 这样做其实是为了方便用 json 表示。
LLVM 的 IR 是没有这样限制的。

TODO

# codegen

SSA 到 x86 的 codegen 可以简单地用 rewrite rule 实现。
由于我们有 structural 的数据类型 sexp，
所以使用 rewrite rule 很方便。
