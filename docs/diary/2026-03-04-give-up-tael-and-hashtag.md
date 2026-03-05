---
title: give up tael and hashtag
date: 2026-03-04
---

决定实现简单类型系统之后的新计划：

- 放弃 list 和 record 融合的 tael。
- 放弃用 hashtag 实现 bool 和 void。
  - 避免不必要的 subtype 关系。
- 放弃 null，使用类似 maybe type 的方式来处理 optional。

最重要的 subtype 关系来自 record，
单独实现 record，可以在当前计划失败时完全放弃 subtype。

另外的 subtype 关系来自 tuple 和 list，
必要的时候可以放弃 subtype，在语法上区分 tuple 和 list。

采用保守的语法设计 -- `@list` `@record` `@tuple`。
避免过早将 `[]` 和 `{}` 设计为语法糖。

# list

list 作为 builtin type。
放弃对 list 的 pattern matching。
放弃 cons car cdr 这三个函的类型应该是 list 而不是 tuple。

# fallback

项目的 scope 可以 fallback 到类似 haskell 和 miranda 的类型系统，
即完全不带有 subtype 关系的类型系统。
