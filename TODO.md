# local (define)

[meta-lisp.js] 删除 `(letrec)` 语法

[docs] [reference] syntax.md -- 说明为什么没有 `(letrec)`

- 要么就放弃 letrec 这个语法。
- 要么给出更好的运行时报错。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
