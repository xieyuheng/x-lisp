# syntax

[meta-lisp.js] refactor `ImportPass`

[meta-lisp.js] `ImportPass` -- `ImportAll` -- if name is already defined in the module, do not import

- module can override builtin names

[meta-lisp.js] fix pass ordering `CheckPass` after `QualifyPass`

[meta-examples.meta] test module can override builtin names

[meta-lisp.js] fix the use of `type-t` and remove `(define-type)`

- maybe add `(claim-type)` syntax `(claim-type type-t)` is not recursive like `(claim type-t type-t)`

[meta-lisp.js] `ImportPass` -- `ImportAll` -- need to handle builtin mod specially

- `type-t` is not declared in fragment

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
