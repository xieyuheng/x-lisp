[meta-lisp.js] [refactor] DesugarPass 避免使用 State

DesugarPass 的 State 中带有 `nameCounts: Map<string, number>`，
这种 generateFreshName 对 State 的用法并不安全。
可否改为使用 expOccurredNames + generateRelativeFreshName，
从而完全比避免多一个 State 参数？

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
