[meta-lisp.js] 我计划区分 Exp（desugar 之前表达式） 与 Term（desugar 之后表达式）。

- 模仿 exp/ 设立 term/
- Term 的定义可以参考 exp/expIsCore，但是注意，我们的 Term 不包含 Match。
- Stmt 要带有类型参数 E，E 可以是 Exp 也可以是 Term
- ModFragment 要带有两个字段 stmts: Array<M.Stmt<M.Exp>> 和 desugaredStmts: Array<M.Stmt<M.Term>>
 Term 是独立于 Exp 的 type，不重用 variable
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
