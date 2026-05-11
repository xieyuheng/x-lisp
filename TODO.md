[meta-lisp.js] remove subtype
[meta-lisp.js] [maybe] remove `keyword-t`

# algebraic type

[meta-lisp.js] `(define-data)` defines new value -- different from list and record
[stack-lisp.c] support `xdata_t`
- or `algebraic_data_t`
- or `datum_t`
- or `xrecord_t` -- because of `(define-record-type)`?
[meta-lisp.js] `ExpandPass` -- should only generate modifiler with side-effect
[meta-lisp.js] rename `DefinedDataType` to `DataType` or `AlgebraicType`

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
