# local (define)

[meta-lisp.js] 在 desugar 中模仿  Assign 对直接 desugar  LocalDefine 的 情况报错。

- Assign 和 LocalDefine 只能出现在 Begin 的 body 中。

[meta-example.meta] expSubst 处理 Assign 和 LocalDefine 的方式错了

和 desugarDefine 类似，Assign 和 LocalDefine 只能出现在 Begin 的 body 中。
需要有 substBegin 而不应该有对 Assign 和 LocalDefine 的直接 subst（遇到时报错）。

[meta-lisp.js] fix the problem of letrec-sequential-binding-error.meta

- 要么就放弃 letrec 这个语法。
- 要么给出更好的运行时报错。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
