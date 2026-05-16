---
title: reach comment style
date: 2026-05-16
---

# reach 注释风格

## 问题

代码中有些分支的解释性注释，目的是说明"这条控制流路径在什么场景下会被走到"（即执行路径的**可达性**）。

传统的注释风格（如 `// - xxx` 或 `// NOTE: xxx`）不能明确区分这是一条功能说明还是一个可达性解释。

## 约定

使用 `reach:` 前缀来标记可达性注释：

```
// - reach: inferLookup is called for B while checking A,
//   and tryInferDefinitionBody has pre-allocated a fresh type
//   variable for B, meaning B is in a mutual-recursive group with A.
//   Return this fresh variable immediately to avoid infinite recursion.
```

`reach:` 前面的 `// -` 延续了项目中已有的多级注释风格。

## 示例

在 `check/infer.ts` 的 `inferLookup` 函数中，三步逻辑分别用 `reach:` 注释解释：

1. mutual-recursion 分支——`inferLookup` 被调用时，B 有预分配的 fresh type variable
2. dependency ordering 分支——B 在模块中定义靠后，按需检查
3. result retrieval 分支——`definitionCheck` 之后，inferred type 已被写入 mod

三个 `reach:` 注释完整覆盖了所有控制流路径的触发条件。
