# assembly-lisp

[learn] 先写 assembly-lisp 代码的例子试试，然后再决定是否修改语法。

[meta-runtime.c] 设计新的 `xexe_t` 格式，用一个 buffer 忠实反应数据内容，然后设计 API 函数都直接操作 buffer。

[meta-lisp.js] 为了让 assembly-lisp 更方手写。

- TODO

assembly-lisp 的文档： docs/zh/assembly-lisp/*
assembly-lisp 的实现： [meta-lisp.js] 中的 x86/*

# self-hosting

[meta-lisp.meta] [review] env.meta
[meta-lisp.meta] [review] apply.meta
[meta-lisp.meta] [review] evaluate.meta

[meta-lisp.meta] 110-locate-pass.meta
[meta-lisp.meta] 120-check-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 140-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# compile to native
# socket api and network programming
# http library
# write agent in meta-lisp
