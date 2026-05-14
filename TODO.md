# local (define)

[meta-lisp.js] `expSubst`

我计划实现 `expSubst` 可以把一个表达式中的变量代替为另一个表达式，
应该如何设计？

注意：

- 需要正确处理 lambda。


[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
