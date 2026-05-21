---

[meta-lisp.js] basic -- add *Instr to Instr

在 [meta-lisp.js] 的 basic 中，给 Instr 的 variant 加上 *Instr 后缀。

注意：

- variant 的 constructor 函数也要修改。
- kind 字段也要修改。

---

[meta-lisp.js] basic -- add *Exp to Exp

在 [meta-lisp.js] 的 basic 中，给 Exp 的 variant 加上 *Exp 后缀。

注意：

- variant 的 constructor 函数也要修改。
- kind 字段也要修改。

---

[meta-lisp.js] meta -- add *Exp to Exp

---

[meta-lisp.js] meta -- add *Stmt to Stmt

---

[meta-lisp.js] evaluate -- Env 应该像是 Ctx 一样。作为一个 可扩展的 record type 而存在，不应该直接定义为 Map。

---

[meta-lisp.js] evaluate -- mode: EvaluationMode 参数放在 Env 中

[meta-lisp.js] evaluate/ 函数所带有的 mode: EvaluationMode 参数

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
