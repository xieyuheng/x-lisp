---
title: region-based memory allocation lifecycle
authors: [xieyuheng, deepseek]
date: 2026-07-05
---

假设要用 region based memory allocation 来实现编译器，
参考现在的 [meta-lisp.js] 中对 meta-lisp 编译器的实现，
分析编译器中所有用到 value 的生命周期。

# 编译流程（6 阶段，3 次 IR 降级）

源码文本 → [S表达式解析] → Exp AST (~40变体)
        → [Desugar]     → Term IR  (~15变体)   ← 第一次降级
        → [ExplicateControl] → Basic IR (BB+指令) ← 第二次降级
        → [Codegen]      → Xvm/X86 输出          ← 第三次降级

每次降级创建全新的 IR 树，不共享旧树中任何节点。
这是 arena 策略可行的基础。

# 编译阶段列表

阶段 0：解析（Parse）
- 文件 I/O → 字符串 → S表达式解析 → `Stmt<Exp>[]`
- 创建：Sexp 节点、Stmt<Exp>、Exp AST

Pass 010-050：前端变换（Expand / Prelude / ModuleAnalysis / AlgebraicAnalysis / LowerMatch）
- 展开语法糖（define-enum、define-struct 等）
- 模式匹配降级
- 模块分析和代数分析生成分析报告
- 创建：新的 Exp 节点、ModuleAnalysisReport、AlgebraicAnalysisReport

Pass 060：脱糖（Desugar）—— 第一次 IR 降级
- Exp（~40 变体）→ Term（~15 变体）
- 关键转换：Let/Letrec → Let1，Begin → Begin1，And/Or → If，
  @list/@set/@hash → 展开，Pipe/Chain → 展开
- 创建：全新的 Stmt<Term>[]、Term 树

Pass 070-080：模块处理（ModuleImport / Setup）
- 导入符号解析：VarTerm → QualifiedVarTerm
- 创建 Mod 对象，将 Stmt 转化为 Definition

Pass 090-120：类型处理（Claim / Qualify / Locate / Check）
- 类型声明求值（Term → Type）
- 限定自由变量（Qualify）
- 类型推断与检查
- 创建：Type 节点、Subst 映射、Ctx 绑定

Pass 130-160：中间变换（Shrink / Uniquify / LiftLambda / UnnestOperand）
- 移除 TheTerm、alpha 重命名、闭包转换、操作数扁平化
- 创建：新的 Term 节点（Uniquify、LiftLambda 丢弃旧树）

Pass 170：ExplicateControl —— 第二次 IR 降级
- M.Term + M.Definition → B.Mod + B.Block + B.Instr
- 显式化控制流为 basic block
- 遍历所有闭合包中的所有定义，扁平化到同一个 B.Mod

Pass 180/181：代码生成 —— 第三次 IR 降级
- B.Mod → Xvm.Mod 或 X86.Mod
- 创建：Xvm/X86 指令序列

# 值的生命周期总览

```
                  Par Exp Ana Des Mod Set Cla Qua Loc Chk Shr Uniq Lif Unn Expl Cod
Sexp               ████
Stmt<Exp>           ████████████████████
Exp AST             ████████████████████
分析报告                   ████████████
Stmt<Term>                       ██████████████████████████
Term IR                            ██████████████████████████
Type (声明/推断)                          ██████████████████████
Basic IR                                                 ████████
Xvm/X86 输出                                                    ████
```

Par = Parse
Exp = Expand
Ana = ModuleAnalysis + AlgebraicAnalysis
Des = Desugar
Mod = ModuleImport
Set = Setup
Cla = Claim
Qua = Qualify
Loc = Locate
Chk = Check
Shr = Shrink
Uniq = Uniquify
Lif = LiftLambda
Unn = UnnestOperand
Expl = ExplicateControl
Cod = Codegen

可以看到有三条清晰的边界：
- Desugar 前后：Exp AST 消亡，Term IR 诞生
- ExplicateControl 前后：Term IR 消亡，Basic IR 诞生
- Codegen 前后：Basic IR 消亡，输出产物诞生

# Arena 方案

4 个 arena：

| Arena | 名称 | 创建时机 | 销毁时机 | 分配对象 |
|-------|------|---------|---------|---------|
| src | 源码层 | Parse 开始 | Desugar 结束后 | Sexp, Stmt<Exp>, Exp AST, 分析报告 |
| core | 核心 IR | Desugar 开始 | ExplicateControl 结束后 | Stmt<Term>, Term IR, Mod, Definition, Type |
| basic | 基本层 | ExplicateControl 开始 | Codegen 结束后 | B.Mod, B.Block, B.Instr, B.Exp |
| output | 输出层 | Codegen 开始 | 文件写出后 | Xvm.Mod / X86.Mod / 指令 / 操作数 |

分析报告（ModuleAnalysisReport、AlgebraicAnalysisReport）体型小，
且在 Desugar 前就已经生成完毕，随 src arena 一起销毁即可，
不需要单独的 arena。

## arena 生命周期关系

```
src ──[Desugar]──→ core ──[ExplicateControl]──→ basic ──[Codegen]──→ output
```

共存关系：
- src 和 core 短暂共存于 Desugar 期间（Exp 树尚未释放，Term 树正在构建）
- core 和 basic 短暂共存于 ExplicateControl 期间
- basic 和 output 短暂共存于 Codegen 期间

## 跨包编译的 arena 管理

包按拓扑依赖顺序编译。每完成一个包的编译（写出产物），该包的所有 arena 全部销毁。

依赖包的数据存活要求：
- 被依赖包的 Exp AST 在 pass 030/040 时需可读
- 被依赖包的 Term IR + Mod + Definition 在 ExplicateControl 时需可读
  （用于扁平化到 B.Mod）
- 所有跨包引用均为字符串（QualifiedVarTerm），不存在跨包指针——
  这是 arena 友好的设计

Package 对象本身（id、config、dependencies Map）独立于 arena 管理，
arena 仅管理编译过程中产生的大量 AST/IR 节点。

## core arena 的细分

core arena 横跨 11 个 pass，
其中 Uniquify(140) 和 LiftLambda(150) 会丢弃旧 Term 树、重建新树，
在 arena 中旧内存无法回收。
如果内存敏感，可以在这些 pass 间创建子 arena 并立即销毁。
但从简洁性角度，meta-lisp 编译规模通常不大，单一大 arena 就够用。
