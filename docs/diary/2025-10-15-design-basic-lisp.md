---
title: design basic-lisp
date: 2025-10-15
---

# block list vs. instruction list

直接描述 block list
还是描述 instruction list 再生成 block？

如果直接描述 block list 了，
那么有的 function 只有一个 block 怎么办？
另外，一般 function 的开头 block 都是没有名字的。

TODO

# 是否限制 operand 为 variable？

是否像 bril 一样，限制所有的 operand 都是 variable？
bril 这样做其实是为了方便用 json 表示。
LLVM 的 IR 是没有这样限制的。

TODO

# codegen

SSA 到 x86 的 codegen 可以简单地用 rewrite rule 实现。
由于我们有 structural 的数据类型 sexp，
所以使用 rewrite rule 很方便。
