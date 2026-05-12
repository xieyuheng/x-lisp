# subtype

[meta-builtin.meta] `hash-entry-t` use `(define-data)`
[meta-builtin.meta] `source-span-t` use `(define-data)`

[meta-lisp.js] remove row-polymorphism
[meta-lisp.js] remove subtype

# algebraic type

[meta-lisp.js] rename `DefineInterface` to `DefineRecordType`
[meta-lisp.js] rename `DefineData` to `DefineAlgebraicType`
[meta-lisp.js] `ExpandPass` -- should only generate modifiler with side-effect

# any-t

[learn] learn from haskell's `Dynamic`

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
