[meta-lisp.js] `typeBisimilar` handle `AnyType` -- equal only to itself
[meta-lisp.js] `typeSubtype` handle `AnyType` -- as top type

[meta-lisp.js] be clear about how to use untyped meta-lisp
[meta-lisp.js] `(define-data)` defines new value -- different from list and record

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
