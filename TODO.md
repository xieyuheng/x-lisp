[meta-lisp.meta] 中的 define-interface 旧语法，改为 define-struct 新语法。

# literal hash syntax

[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
