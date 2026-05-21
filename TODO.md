---

[meta-example.meta] move (error-module) to [meta-error.meta]
[meta-builtin.meta] move (error-module) to [meta-error.meta]
[meta-lisp.js] remove (error-module) support
[meta-lisp.meta] remove (error-module) support

[meta-error.meta] 在 src/ 中设计一个测试，来验证两个模块中定义的相同结构的 adt 不相等。

---

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
