[meta-lisp.js] 目前的 expSubst 需要处理所有的语法，是否太复杂了？

但是 expSubst 和 desugar 又相互依赖，有没有什么办法能解决这个问题？
避免在 expSubst 中不得不处理所有语法。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
