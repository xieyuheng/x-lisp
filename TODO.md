[meta-lisp.js] 实现 `expNaiveSubst`

- 类似 `expSubst`，但是不处理 capture avoidance，只处理 bound variable shadowing。
- 放在 exp/expNaiveSubst.ts
- 在代码的前面用注释说明 是不处理 capture avoidance，只处理 bound variable shadowing。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
