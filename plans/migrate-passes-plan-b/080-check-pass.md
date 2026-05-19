# 080-CheckPass：迁移到 meta-lisp.meta

参考 `plans/migrate-passes-plan-b/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/080-CheckPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/080-check-pass.meta`

## JS 源码

```ts
import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(
  project: M.Project,
  options: {
    verbose: boolean
    dump: boolean
  },
): void {
  for (const mod of project.mods.values()) {
    if (mod.isErrorModule) {
      withOutputToErrorModuleSnapshot(project, mod.name, () => {
        for (const definition of mod.definitions.values()) {
          performDefinitionCheck(definition, options)
        }
      })
    } else {
      for (const definition of mod.definitions.values()) {
        performDefinitionCheck(definition, options)
      }
    }
  }

  if (options.dump) projectDumpMods(project, "080-check")
}

function withOutputToErrorModuleSnapshot<A>(
  project: M.Project,
  modName: string,
  callback: () => A,
): A {
  const directory = M.projectSnapshotDirectory(project)
  return callWithFile(
    openOutputFile(`${directory}/error-modules/${modName}.out`),
    (file) => withOutputToFile(file, callback),
  )
}

function performDefinitionCheck(
  definition: M.Definition,
  options: {
    verbose: boolean
  },
): void {
  const name = `${definition.mod.name}/${definition.name}`
  const start = performance.now()
  if (options.verbose) M.log("check", `${name} -- start`)

  M.definitionCheck(definition)

  const end = performance.now()
  const passed = end - start
  if (options.verbose)
    M.log("check", `${name} -- end in ${passed.toFixed(3)}ms`)
}
```

## 提示

- `definition-check` 函数应该已在 `projects/meta-lisp.meta` 中定义
- `mod-is-error-module` 判断是否为 error module
- error module 的输出可以用简化方式处理（`writeln` 或直接忽略），不需要完整实现 `with-output-to-error-module-snapshot`
- 如果没有 `definition-check` 函数，请先检查 `projects/meta-lisp.meta/src/meta/check/` 中是否已有
- `(project-mods project)` 得到 hash of mods，用 `hash-each` 遍历
- `(project-dump-mods project "080-check")` 对应 JS 的 `projectDumpMods`
- 查阅 `docs/zh/reference/builtin/index.md` 确认可用函数
