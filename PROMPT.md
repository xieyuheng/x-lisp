# 040-ExecutePass.ts → 040-execute-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/040-ExecutePass.ts`（251 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/040-execute-pass.meta`（新建）
**作用**: 将 project.fragments 中的每个 fragment 转换为 module，评估 stmt 并写入 mod 结构中。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `module-pass` 调用后添加 `(execute-pass project options)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case（如 `mod-name`, `mod-stmts`）
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 遍历 `(project-fragments project)`，对每个 fragment 调用 `M.projectLookupMod`（如已存在）或 `M.createMod`
- 对每个 stmt 做 `match stmt`，按 kind 分发：
  - `exempt-stmt`, `claim-stmt`, `claim-type-stmt`, `admit-stmt` → 加入 mod.claimed / mod.admitted
  - `declare-primitive-function-stmt`, `declare-primitive-variable-stmt` → 调用 mod-claim
  - `define-function-stmt`, `define-variable-stmt`, `define-test-stmt` → 调用 mod-define
  - `define-type-stmt`, `define-algebraic-type-stmt`, `define-opaque-type-stmt` → 处理 data-constructors
- 评估 prim 声明时使用 `M.QualifiedVar("builtin", "type-t", location)` 获取类型
- 如果 options 中有 `dump`，调用 `project-dump-mods project "040-execute"`
- 返回 `void-t`

已有数据结构（定义在 `projects/meta-lisp.meta/src/meta/` 下）：
- `mod-t`: `mod-name`, `mod-stmts`, `mod-admitted`, `mod-claimed`, `mod-definitions`, `mod-data-constructors`
- `project-t`: `project-fragments`, `project-mods`, `project-lookup-mod`, `project-create-mod`
- `env-t`: 环境操作定义在 `src/meta/env/env.meta`
- 评估器定义在 `src/meta/evaluate/evaluate.meta`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 050-ClaimPass.ts → 050-claim-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/050-ClaimPass.ts`（22 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/050-claim-pass.meta`（新建）
**作用**: 遍历所有 module 的 claimed 条目，检查每个 claimed name 是否已在 admitted 或 definitions 中，未定义的报错。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `execute-pass` 调用后添加 `(claim-pass project)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

JS 源码（22 行）：
```typescript
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

迁移要点：
- 仅接受 `project` 参数（无 options），返回 `void-t`
- 遍历 `(project-mods project)` 的每个 mod
- 遍历 `(mod-claimed mod)` — 返回 hash，用 `hash-each` 遍历
- 检查：`name` 不在 `mod-admitted` 且在 `mod-definitions` 中不存在 → 报错
- 错误信息格式与 JS 源码一致（包含 module name, name, 以及 source location 或 exp）
- 使用 `S.sourceLocationReport` 对应的已有函数或内联构造错误信息

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 060-LowerMatchPass.ts → 060-lower-match-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/060-LowerMatchPass.ts`（305 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/060-lower-match-pass.meta`（新建）
**作用**: 将 `match` 表达式降级为嵌套的 `if`/`case` 表达式。这是 match 模式匹配的核心实现。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `claim-pass` 调用后添加 `(lower-match-pass project options)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历 `(project-mods project)`，对每个 mod 的每个定义中的表达式递归做 lower-match
- 降级逻辑：
  - 对 `match-exp`：提取 scrutinee，对每个 clause 生成 case 分支
  - 处理所有 pattern 类型（wildcard, variable, literal, constructor pattern 等）
  - 处理 guard 表达式
  - 确保生成正确的 let-binding 用于模式变量
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "060-lower-match"`
- 返回 `void-t`

已有数据结构：
- `exp-t` enum（`src/meta/exp/exp.meta`）含 `match-exp`, `if-exp`, `let-exp`, `var-exp`, `apply-exp` 等
- `binding-t` struct
- 模式相关结构在 `exp-t` 的数据构造函数中定义

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 070-QualifyPass.ts → 070-qualify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/070-QualifyPass.ts`（160 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/070-qualify-pass.meta`（新建）
**作用**: 将模块内的非限定变量引用（不带 module 前缀的 name）加上正确的 module 前缀，生成 QualifiedVar。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `lower-match-pass` 调用后添加 `(qualify-pass project options)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod，对其 definition bodies 中的 `var-exp` 进行 qualify
- 取消限定逻辑：
  - 如果变量名在 mod 的 env 中 → 使用当前 module 的 qualified name
  - 如果不在 → 遍历 imports，检查其他 module 是否有对应 binding
- 处理 qualified import 和 unqualified import
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "070-qualify"`
- 返回 `void-t`

已有数据结构：
- `mod-t` 的 import 相关字段
- 环境查询函数在 `src/meta/env/env.meta`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 080-CheckPass.ts → 080-check-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/080-CheckPass.ts`（64 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/080-check-pass.meta`（新建）
**作用**: 对所有 module 的 definition 做类型检查。跳过 error module，对每个 definition 调用 definitionCheck。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `qualify-pass` 调用后添加 `(check-pass project options)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `verbose`, `dump` 字段）
- 遍历 `(project-mods project)`，跳过 error modules
- 对每个 definition 调用 `definition-check`（已定义在 `src/meta/definition/` 下）
- verbose 模式下打印计时信息
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "080-check"`
- 返回 `void-t`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 090-LocatePass.ts → 090-locate-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/090-LocatePass.ts`（199 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/090-locate-pass.meta`（新建）
**作用**: 定位特殊的 function apply（如对内置函数的调用），将其转换为特殊的 apply exp（如 `primitive-apply-exp`, `tail-apply-exp` 等）。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `check-pass` 调用后添加 `(locate-pass project options)`

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod 的 definition bodies
- 检查每个 `apply-exp` 的 operator：
  - 如果是 qualified var 且指向 builtin prim → 转换为 `primitive-apply-exp`
  - 如果是 tail 位置 → 转换为 `tail-apply-exp`
  - 如果是已知函数 → 转换为 `function-apply-exp`
  - 其他 → 保持为普通 `apply-exp`
- 需要检查 apply 是否在 tail position（递归判断）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "090-locate"`
- 返回 `void-t`

已有数据结构：
- primitive 名称列表在 `src/meta/mod/` 相关文件中
- `exp-t` 包含 `primitive-apply-exp`, `tail-apply-exp`, `function-apply-exp` 等 variant

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 100-ShrinkPass.ts → 100-shrink-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/100-ShrinkPass.ts`（48 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/100-shrink-pass.meta`（新建）
**作用**: 收缩表达式——移除 let 绑定的未使用变量、简化常量表达式（如 `(and)` → `true`）。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions，递归收缩每个 expression：
  - 对 `let-exp` 检查 binding 是否在被 body 中使用 → 未使用则移除
  - 对 `and-exp` with 空 list → 替换为 `(var-exp 'true)`
  - 对 `or-exp` with 空 list → 替换为 `(var-exp 'false)`
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "100-shrink"`
- 返回 `void-t`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 110-UniquifyPass.ts → 110-uniquify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/110-UniquifyPass.ts`（112 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/110-uniquify-pass.meta`（新建）
**作用**: 给所有局部变量加上唯一后缀，确保没有变量名遮蔽（shadowing）。每个 lambda/let 绑定的变量会被重命名为 `originalName__N`。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions
- 对每个函数体/let body 递归重命名：
  - 维护一个 substitution map：原始名 → 新名（带唯一后缀）
  - `var-exp` 中的变量引用替换为新名
  - `lambda-exp` 参数和 `let-exp` 绑定用计数器生成新名
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "110-uniquify"`
- 返回 `void-t`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 120-LiftLambdaPass.ts → 120-lift-lambda-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/120-LiftLambdaPass.ts`（92 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/120-lift-lambda-pass.meta`（新建）
**作用**: 将匿名 lambda 提升为顶层函数定义。每个 lambda 会生成一个带唯一名字的顶层 function definition，lambda 位置替换为对该函数的 var-ref。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 递归遍历所有 mod 的 definition bodies，寻找 `lambda-exp`
- 对每个 lambda：
  - 收集所有自由变量作为额外参数
  - 生成唯一函数名（如 `lambda__N`）
  - 创建顶层 `define-function-stmt`（包含自由变量 + lambda 参数）
  - lambda 位置替换为对该函数的 `var-exp`（applied to 自由变量）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "120-lift-lambda"`
- 返回 `void-t`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 130-UnnestOperandPass.ts → 130-unnest-operand-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/130-UnnestOperandPass.ts`（131 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/130-unnest-operand-pass.meta`（新建）
**作用**: 将嵌套的复杂操作数提升为 let 绑定，确保每个 primitive apply 的操作数都是原子值（变量或字面量）。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

迁移要点：
- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 递归遍历所有 definition bodies
- 对每个 `primitive-apply-exp`：检查每个参数是否为原子值
  - 非原子参数（如 `(+ (+ 1 2) 3)` 中的 `(+ 1 2)`）→ 提升为 `let` 绑定
- 对每个 `apply-exp` / `tail-apply-exp` / `function-apply-exp` 类似处理
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "130-unnest-operand"`
- 返回 `void-t`

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 140-ExplicateControlPass.ts → 140-explicate-control-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/140-ExplicateControlPass.ts`（379 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/140-explicate-control-pass.meta`（新建）
**作用**: 显式化控制流——将 if 表达式、函数调用等转换为 basic blocks 和 gotos。这是从高级 IR 到低级 IR 的关键步骤。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`
- 注意：此 pass 的 JS 签名返回 mod 而非 void — `ExplicateControlPass(project: M.Project): B.Mod`

迁移要点：
- 函数接受 `project`，返回 `basic-mod`（基本块 module）
- 创建新的 basic module（`M.createMod`）
- 遍历所有 mod 的 definitions，将每个 definition 转换为 basic blocks：
  - 函数入口 → `label` 开头
  - `if-exp` → 条件跳转
  - `primitive-apply-exp` → 指令 + 跳转到 next label
  - return 处 → 跳转到 function exit
- 处理 tail call 优化：`tail-apply-exp` → 尾调用指令而非普通调用
- 返回 `basic-mod`：basic module 对象

已有数据结构参考：
- basic 模块结构定义在 JS 侧 `projects/meta-lisp.js/src/basic/` 目录

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。


# 150-CodegenPass.ts → 150-codegen-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/150-CodegenPass.ts`（440 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/150-codegen-pass.meta`（新建）
**作用**: 将 basic blocks 转换为 stack VM 指令。将 basic-form IR 转换为 stack-form。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

迁移规则：
- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 参考已有的 .meta pass 文件格式：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`
- 注意：此 pass 的 JS 签名接受 `basicMod` 参数并返回 stack mod — `CodegenPass(project: M.Project, basicMod: B.Mod): Stk.Mod`

迁移要点：
- 函数接受 `project` 和 `basic-mod`（由 ExplicateControlPass 返回），返回 `stack-mod`
- 需要处理：
  - 寄存器分配（symbol → index mapping）
  - 每个 basic 指令 → 对应 stack 指令
  - label → stack label 映射
  - 控制流指令（goto, if-goto）→ 栈指令的跳转
  - 尾调用优化保留
- 返回 stack mod：包含转换后的 stack 定义
- 与 JS 源码 `M.CodegenPass(project, basicMod): Stk.Mod` 保持一致的输入输出

已有数据结构参考：
- stack 模块结构参考 JS 侧 `projects/meta-lisp.js/src/stack/` 目录

验证：在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
