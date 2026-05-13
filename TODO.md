# remove (define-type)

[meta-lisp.js] 删除 `(define-type)`

# (import-all) override

[meta-lisp.js] `ImportPass` -- `ImportAll` -- if name is already defined in the module, do not import

- module can override builtin names

[meta-examples.meta] test module can override builtin names

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
