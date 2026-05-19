# 140-ExplicateControlPass.ts → 140-explicate-control-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/140-ExplicateControlPass.ts`（379 行）
**作用**: 显式化控制流——将高级 IR (exp-t) 转换为 basic IR (basic blocks + gotos)。这是从高级 IR 到低级 IR 的关键步骤。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 重要: 需要先定义 Basic IR 类型

meta-lisp.meta 中**已有** `src/basic/` 目录，但需要确认以下类型是否完整:

```
src/basic/mod.meta         -- basic-mod-t (definitions)
src/basic/exp.meta         -- basic-exp-t (symbol-exp, var-exp, apply-exp ...)
src/basic/instr.meta       -- basic-instr-t (assign-instr, perform-instr, test-instr, branch-instr, goto-instr, return-instr)
src/basic/block.meta       -- basic-block-t (label, instrs, location)
src/basic/definition.meta  -- basic-definition-t (各种 definition variant)
```

如果缺失，需要在迁移前创建（或在 pass 文件中直接定义所需结构体）。

## 迁移要点

- **函数签名**: `(define (explicate-control-pass project) basic-mod)`,返回 `basic-mod-t`，不是 void
- 创建新的 basic module（需要 basic mod 构造函数）
- 遍历所有 mod（跳过 error module），对每个 definition:
  - `primitive-function-declaration` / `primitive-variable-declaration` → 转换到 basic 对应类型
  - `type-definition` / `algebraic-type-definition` / `opaque-type-definition` → 跳过，不生成 basic 代码
  - `function-definition` / `variable-definition` / `test-definition` → 转换为 basic blocks:
    - 入口: label "body"，参数存入 blocks
    - 表达式遍历:
      - `let1-exp` → `Assign` + 递归
      - `begin1-exp` → `Perform` + 递归
      - `if-exp` → `Test` + `Branch`，生成 then/else label 并跳转
      - 其他 exp → `Return`
    - tail position: 递归到最终 `Return`
- 重要转换:
  - `var-exp` → `basic-var-exp`（保持原样）
  - `qualified-var-exp` → `basic-var-exp`（name 为 `modName/name`）
  - `apply-exp` → `basic-apply-exp`（target + args 递归转换）
  - `let1-exp` 的 rhs 中若还有嵌套 let1/begin1/if → 展开处理
- 返回 basic mod: 包含所有转换后的 basic definitions

## 提示

- 用 `make-hash` 作为 state.blocks（label → block）管理 basic blocks
- 方法: helper 函数 `add-block`、`generate-label` 生成唯一 label
- `to-basic-exp` 将 meta exp 转为 basic exp（只处理 atom + apply 等低级 exp）
- `in-tail` 遍历 exp 返回 `list-t basic-instr-t`
- `in-if` 处理 if 的条件，分支生成 label + goto
- `in-let1` / `in-begin1` 将嵌套结构折叠为 assign/perform + continuation

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
