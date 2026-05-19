# 050-ClaimPass：迁移到 meta-lisp.meta

参考 `plans/migrate-passes-plan-b/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/050-ClaimPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/050-claim-pass.meta`

## JS 源码

```ts
import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ClaimPass(project: M.Project): void {
  for (const mod of project.mods.values()) {
    for (const [name, entry] of mod.claimed) {
      if (!mod.admitted.has(name) && mod.definitions.get(name) === undefined) {
        let message = `undefined claimed name`
        message += `\n  module: ${mod.name}`
        message += `\n  name: ${name}`

        if (entry.exp.location) {
          writeln(S.sourceLocationReport(entry.exp.location, message))
        } else {
          message += `\n  exp: ${M.formatExp(entry.exp)}`
          writeln(message)
        }
      }
    }
  }
}
```

## 提示

- 此 pass 不需要 `options` 参数（没有使用 dump）
- `(project-mods project)` 得到 hash of mods
- `(hash-each (lambda (name mod) ...) (project-mods project))` 遍历 mods
- `(mod-claimed mod)` 得到 hash of `claim-entry-t`，`(claim-entry-exp entry)` 访问 exp
- `(mod-admitted mod)` 得到 set of symbol
- `(mod-definitions mod)` 得到 hash of `definition-t`
- `(set-member? elem set)` 检查 set 成员
- `(symbol-to-string sym)`、`(string-concat strs)`、`(writeln msg)` 用于报错
- 此 pass 逻辑简单：检查所有 claimed 的名称是否有对应的 definition 或 admitted
