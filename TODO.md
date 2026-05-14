# local (define)

[meta-example.meta] 模仿 letrec-star-sequential-binding.meta 和 letrec-star-even-odd.meta 给 local define 写两个测试。

[meta-lisp.js] fix the problem of letrec-sequential-binding-error.meta

- 要么就放弃 letrec 这个语法。
- 要么给出更好的运行时报错。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
