[meta-lisp.js] [refactor] LocatePass 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。
[meta-lisp.js] [refactor] qualifyDefinition 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。

[meta-lisp.js] [refactor] 简化 OpaqueTypeDefinition

OpaqueTypeDefinition 是否不需要

  representationTypeExp: Exp,
  representationType?: Type,

而是需要

  representationType: Type,

吧？

[meta-lisp.js] [refactor] 这里错了，看来 TypeConstructor 的 definition 应该是一般的 definition 而不是 AlgebraicTypeDefinition

 ```
 if (stmt.kind === "DefineOpaqueType") {
    const name = stmt.name
    const typeConstructor: M.TypeConstructor = {
      definition: undefined as unknown as M.AlgebraicTypeDefinition,
      name: stmt.name,
      parameters: stmt.parameters,
      location: stmt.location,
    }
 ```

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
