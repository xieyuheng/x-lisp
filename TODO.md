---

[meta-lisp.js] evaluate -- mode: EvaluationMode 参数放在 Env 中

现在 [meta-lisp.js] 的 evaluate 函数所带有的 mode: EvaluationMode 参数。

是否在整个 递归调用的过程中，都是不变的？
如果是不变的，那就应该放在 env 中。而不应该让 evaluate/ 在 env 这个参数之外多一个参数。

- evaluateType 和 apply 也要类似的减少 mode: EvaluationMode 参数

---

[meta-error.meta] setup project
[meta-error.meta] move (module-error) to normal (module) here

[meta-builtin.meta] (error) should only take message string

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
