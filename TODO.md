[meta-lisp.js] 把 DesugarPass 中所有具体的对 variant 的辅助函数 比如 desugarPipe desugarSet 等等，全部都放在 meta/desugar/ 中。

- 一个 desugar 辅助函数一个文件。
- 通过 index.ts export 出来。
- LowerMatchPass 中的 simplifyMatch 改名为 desugarMatch 也放在 meta/desugar/ 中。

[meta-lisp.js] 我计划区分 Exp（desugar 之前表达式） 与 Term（desugar 之后表达式）。

[meta-lisp.meta] [review] exp-free-names.meta
[meta-lisp.meta] [review] exp-location.meta
[meta-lisp.meta] [review] exp-naive-subst.meta
[meta-lisp.meta] [review] exp-occurred-names.meta
[meta-lisp.meta] [review] exp-traverse.meta

[meta-lisp.meta] [review] stmt.meta
[meta-lisp.meta] [review] value.meta
[meta-lisp.meta] [review] type.meta
[meta-lisp.meta] [review] env.meta -- use (define-opaque-type)
[meta-lisp.meta] [refactor] parse-exp
