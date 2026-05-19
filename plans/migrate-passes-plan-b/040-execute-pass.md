# 040-ExecutePass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/040-ExecutePass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/040-execute-pass.meta`

## JS 源码

```ts
import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"

export function ExecutePass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const [path, fragment] of project.fragments) {
    let mod =
      M.projectLookupMod(project, fragment.modName) ||
      M.createMod(fragment.modName, project)

    M.projectAddMod(project, mod)

    if (fragment.isErrorModule) {
      mod.isErrorModule = true
    }

    for (const stmt of fragment.stmts) {
      executeStmt(mod, stmt)
    }
  }

  if (options.dump) M.projectDumpMods(project, "040-execute")
}

function executeStmt(mod: M.Mod, stmt: M.Stmt): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.admitted.add(name)
    }
  }

  if (stmt.kind === "Claim") {
    M.modClaim(mod, stmt.name, stmt.type)
  }

  if (stmt.kind === "ClaimType") {
    mod.claimed.set(stmt.name, {
      exp: M.QualifiedVar("builtin", "type-t", stmt.location),
      type: M.TypeType(),
    })
  }

  if (stmt.kind === "Admit") {
    M.modClaim(mod, stmt.name, stmt.type)
    mod.admitted.add(stmt.name)
  }

  if (stmt.kind === "DeclarePrimitiveFunction") {
    const definition = M.modLookupDefinition(mod, stmt.name)
    if (definition && definition.kind === "PrimitiveFunctionDefinition") {
      if (definition.arity !== stmt.arity) {
        let message = `[executeDefine] arity mismatch`
        message += `\n  definition name: ${definition.name}`
        message += `\n  definition arity: ${definition.arity}`
        message += `\n  declared arity: ${stmt.arity}`
        throw new Error(message)
      }
    } else {
      M.modDefine(
        mod,
        stmt.name,
        M.PrimitiveFunctionDeclaration(
          mod,
          stmt.name,
          stmt.arity,
          stmt.location,
        ),
      )
    }
  }

  if (stmt.kind === "DeclarePrimitiveVariable") {
    const definition = M.modLookupDefinition(mod, stmt.name)
    if (definition && definition.kind === "PrimitiveVariableDefinition") {
      return
    } else {
      M.modDefine(
        mod,
        stmt.name,
        M.PrimitiveVariableDeclaration(mod, stmt.name, stmt.location),
      )
    }
  }

  if (stmt.kind === "DefineFunction") {
    M.modDefine(
      mod,
      stmt.name,
      M.FunctionDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.location,
      ),
    )
  }

  if (stmt.kind === "DefineVariable") {
    M.modDefine(
      mod,
      stmt.name,
      M.VariableDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineTest") {
    M.modDefine(
      mod,
      stmt.name,
      M.TestDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineType") {
    if (stmt.parameters.length === 0) {
      M.modClaim(
        mod,
        stmt.name,
        M.QualifiedVar("builtin", "type-t", stmt.location),
      )
    } else {
      M.modClaim(
        mod,
        stmt.name,
        M.Arrow(
          range(stmt.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t", stmt.location),
          ),
          M.QualifiedVar("builtin", "type-t", stmt.location),
          stmt.location,
        ),
      )
    }

    M.modDefine(
      mod,
      stmt.name,
      M.TypeDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.location,
      ),
    )
  }

  if (stmt.kind === "DefineAlgebraicType") {
    const name = stmt.typeConstructor.name
    const typeConstructor = stmt.typeConstructor
    const dataConstructors = stmt.dataConstructors.map(
      (ctor): M.DataConstructor => ({
        definition: undefined as unknown as M.AlgebraicTypeDefinition,
        name: ctor.name,
        fields: ctor.fields.map((field) => ({
          name: field.name,
          type: field.type,
          location: field.location,
        })),
        location: ctor.location,
      }),
    )

    const definition = M.AlgebraicTypeDefinition(
      mod,
      name,
      typeConstructor,
      dataConstructors,
      stmt.location,
    )

    for (const dataConstructor of dataConstructors) {
      dataConstructor.definition = definition
    }

    M.modDefine(mod, name, definition)

    if (typeConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.QualifiedVar("builtin", "type-t", stmt.location))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(typeConstructor.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t", stmt.location),
          ),
          M.QualifiedVar("builtin", "type-t", stmt.location),
          stmt.location,
        ),
      )
    }

    for (const dataConstructor of dataConstructors) {
      mod.dataConstructors.set(dataConstructor.name, dataConstructor)
    }
  }

  if (stmt.kind === "DefineOpaqueType") {
    const name = stmt.name
    const typeConstructor: M.TypeConstructor = {
      name: stmt.name,
      parameters: stmt.parameters,
      location: stmt.location,
    }

    const definition = M.OpaqueTypeDefinition(
      mod,
      name,
      typeConstructor,
      stmt.representationType,
      stmt.interfaceFunctions.map((f) => ({
        name: f.name,
        type: f.type,
        location: f.location,
      })),
      stmt.location,
    )

    M.modDefine(mod, name, definition)

    if (stmt.parameters.length === 0) {
      M.modClaim(mod, name, M.QualifiedVar("builtin", "type-t", stmt.location))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(stmt.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t", stmt.location),
          ),
          M.QualifiedVar("builtin", "type-t", stmt.location),
          stmt.location,
        ),
      )
    }

    for (const iface of stmt.interfaceFunctions) {
      const wrappedType = M.Polymorphic(
        stmt.parameters,
        iface.type,
        iface.location,
      )
      M.modClaim(mod, iface.name, wrappedType)
      mod.opaqueClaimed.set(iface.name, wrappedType)
    }
  }
}
```

## 提示

- 参考 `010-expand-pass.meta` 中遍历 fragments 的模式
- 用 `(hash-each (lambda (path fragment) ...) (project-fragments project))` 遍历
- `make-mod`, `project-lookup-mod`, `project-add-mod` 可用
- stmt 用 `match` 匹配各变体（`define-function-stmt?`、`define-variable-stmt?` 等自动生成的判断函数）
- `mod-define`, `mod-claim`, `set-add` 可用
- `project-dump-mods` 对应 JS 的 `projectDumpMods`
- `(hash-has? 'dump options)` 判断是否需要 dump
- 查阅 `docs/zh/reference/builtin/index.md` 确认 list/hash/set 操作函数名
- 查阅 `docs/zh/reference/syntax.md` 确认语法
