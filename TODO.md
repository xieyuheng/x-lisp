# local (define)

[meta-lisp.js] 把对 match 的处理从 DesugarPass 中拆出来，成为一个新的 pass -- LowerMatchPass。

[meta-lisp.js] fix missing case of 007.3-ModuleImportPass.ts

---

[plan] 007.3-ModuleImportPass.ts 有 bug，它只处理了 `Let1`，
也就是只处理了 DesugarPass 之后的情况。

我在考虑 010-DesugarPass.ts 可否放在 007-ModulePass 之前。
但是 010-DesugarPass.ts 在调用  M.simplifyMatch 时，依赖了 `mod`。

你帮我看一下 M.simplifyMatch 是否可以不依赖 `mod`。

---

[answer]

simplifyMatch 对 mod 的依赖很深，无法轻易剥离。来看具体依赖链：
simplifyMatch(mod, targets, clauses, defaultExp, location)
                    │
                    ├── groupClausesByHeadDataConstructor(mod, clauses)
                    │     ├── findAlgebraicTypeDefinitionFromClauses(mod, clauses)
                    │     │     └── dataPatternDataConstructor(mod, pattern)
                    │     │           └── modLookupDataConstructor(mod, name)
                    │     │                 └── mod.definitions  ◄── 需要解析后的模块
                    │     │
                    │     └── dataConstructorEqual(dataPatternDataConstructor(mod, p), dc)
                    │
                    ├── modNameIsAsDefined(mod, predicateName)  ◄── 查找模块定义
                    ├── modNameIsAsDefined(mod, accessorName)   ◄── 查找模块定义
                    └── Path.relative(Path.dirname(mod.name), definition.mod.name)
                               ◄── 需要模块名来生成 qualified 引用

核心问题：dataPatternDataConstructor 必须通过模块查找构造函数名对应的 DataConstructor 对象（字段名、访问器名等），这些信息只在 ModulePass 解析完成后才存在。

建议方案：拆分 DesugarPass

将当前 010-DesugarPass 拆为两个 pass：

pass	位置	功能
010-DesugarPass	ModulePass 之前	除 Match 外的所有 desugar（LetrecStar、Let、LetStar、Begin、List 等）
011-MatchDesugarPass	ModulePass 之后	仅 simplifyMatch（依赖 mod）

改动量：

1. 新建 011-MatchDesugarPass.ts — 只处理 Match case，从当前 DesugarPass 提取相关代码
2. 修改 010-DesugarPass.ts — 移除 Match case，不再需要 state.mod
3. 修改 pipelines/BuildPipeline.ts — 在 pipeline 中插入新 pass
4. 修改 010-DesugarPass.ts 中的 desugar 函数 — 不再递归 desugar Match（Match 已被移除）

这样 LetrecStar 在 010 被 desugar 掉，007 系列 pass 根本不会看到它。而 Match 延迟到 011 在 mod 可用时处理。

---

[plan]

- MatchDesugarPass 改名为 LowerMatchPass。
- LowerMatchPass 是不是还要调用 DesugarPass 来处理 match 所生成的新代码？

---

[meta-lisp.js] support using `(define)` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
