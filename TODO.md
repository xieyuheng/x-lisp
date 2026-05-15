[meta-lisp.js] [refactor] definitionCheck 在 OpaqueTypeDefinition 的情况，是需要展开检查内部的。

- 类似 AlgebraicTypeDefinition 的情况。

[meta-lisp.js] [refactor] 在 checkClaimedType 外部构造 ctx，作为第二个参数传递进去。

- 而不给 checkClaimedType 传递 opaqueNames，让它自己构造 ctx。

[meta-lisp.js] [refactor] formatDefinition 在 OpaqueTypeDefinition 的 case 应该打印完整信息。
  你可以实现辅助函数来打印内部的信息。
  模仿 formatDefinition 的其他 case。

[meta-lisp.js] [refactor] LocatePass 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。
[meta-lisp.js] [refactor] qualifyDefinition 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。
[meta-lisp.js] [refactor] lowerMatchDefinition 不用处理 AlgebraicTypeDefinition，因为里面不允许有 Match。

- 类似 OpaqueTypeDefinition 不需要处理 Match

[meta-lisp.js] [refactor] typeInferVarInMod 改名为 typeInferLookup

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
