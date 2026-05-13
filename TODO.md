[meta-examples.meta] more test about builtin override

- 在 [meta-examples.meta] 写一个简短的测试，通过把 type-t 定义为 define-enum，
  证明 type-t 这个 builtin type，可以被 override。

# syntax

[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
