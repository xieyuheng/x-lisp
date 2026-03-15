---
title: polymorphic and subtype
date: 2026-03-15
---

子类型关系，如何与 polymorphic 相容？

- 方案 A：
  interface 不因该把 null unify 到 interface-with-row 的变量上，
  简单的 interface 在 unify 过程中不影响 row variable。

- 方案 B：
  所有 interface 都带有一个隐藏的 row variable。
  这显然是不对的，因为 dot 可以通过 unify 取不存在的 field。
