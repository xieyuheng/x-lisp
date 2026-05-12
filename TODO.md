# algebraic type

[meta-lisp.js] no deep walk duing `typeUnify`
[meta-lisp.js] no deep freshen duing `typeUnify`

[meta-lisp.js] remove `formatTypeInMod`
[meta-lisp.js] `ExpandPass` -- should only generate modifiler with side-effect
[meta-lisp.js] refactor `simplifyMatch` -- maybe no need `mod`?

[meta-lisp.js] rename `DefineData` to `DefineEnum`
[meta-lisp.js] `DefineStruct`
[meta-lisp.js] `DefineEnum`
[meta-lisp.js] `DefineEnum` desugar to `DefineAlgebraicType`
[meta-lisp.js] `DefineStruct` to desugar to `DefineAlgebraicType`
[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

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
