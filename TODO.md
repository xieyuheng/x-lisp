---

[meta-error.meta] setup project

模仿 meta-example.meta 创建一个叫做 meta-error.meta 的新项目

---

[meta-example.meta] move (error-module) to [meta-error.meta]
[meta-builtin.meta] move (error-module) to [meta-error.meta]

[meta-lisp.js] remove (error-module) support
[meta-lisp.meta] remove (error-module) support

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
