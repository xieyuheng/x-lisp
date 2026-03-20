---
title: simple row polymorphic can not handle record-merge
date: 2026-03-20
---

简单的 row polymorphic 只能支持 `(:field record)` 语法的类型，
但是不能支持 `(record-merge lhs rhs)` 的类型。

想要支持 `record-merge` 的类型，
可能不可避免要引入 qualified type。

并且把简单的 unification 改为通用的 constraint solving。

方案 A：

- 暂时只实现简单的 row polymorphic。
  只能支持 `(:field record)` 而不支持 `record-merge`。

方案 B：

- 完全放弃 subtype。
  此时为了避免 constructor 依赖参数顺序，
  需要支持 named arguments。
