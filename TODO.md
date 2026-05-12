# algebraic type

[meta-lisp.js] `Type` should not be encoded in `Value`

-  现在在 Type.ts 的定义中，Type 的概念是嵌入在 Value 中。
   模仿 Value.ts 的定义，把 Type.ts 中的 Type 定义为 ADT。

- 在 evaluate.ts 之外，在 type/typeEvaluate.ts 定义 typeEvaluate 返回 Type，独立于 evaluate。
- 不需要保留 evaluate.ts 和 Value.ts。

[meta-lisp.js] remove `evaluate`
[meta-lisp.js] remove `Value`

[meta-lisp.js] `DefineAlgebraicType`

[meta-lisp.js] rename `DefineData` to `DefineEnum`
[meta-lisp.js] `DefineStruct`
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
