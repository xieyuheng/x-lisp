[meta-lisp.js] [refactor] ExecutePass -- 这里错了 TypeConstructor 的 definition 被要求 AlgebraicTypeDefinition：

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

你有什么修改建议？

[meta-lisp.js] [refactor] LocatePass 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。
[meta-lisp.js] [refactor] qualifyDefinition 需要处理 OpaqueTypeDefinition，类似 AlgebraicTypeDefinition。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
