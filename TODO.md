# setup feedback loop

[meta-lisp.meta] complete `parse-exp`

- 根据 [meta-lisp.js] 中 `parseExp` 的定义，补全 [meta-lisp.meta] 中 `parse-exp` 的定义。

[meta-lisp.meta] `parse-stmt`
[meta-lisp.meta] `check-pipeline`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function
