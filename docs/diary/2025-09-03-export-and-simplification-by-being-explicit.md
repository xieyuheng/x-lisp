---
title: (export) and simplification by being explicit
date: 2025-09-03
---

当加上 explicit 的 `(export)` 语法之后，
我发现可以删除 `Mod` 的 `included` 和 `imported`，
也可以删除 `Definition` 的 `isPrivate`。

也就是说，简化一个东西的思路，
可能让某个东西变成 explicit 的。

比如 haskell 需要 monad transformer
是因为 implicit type class 吗？
在 F# 中没有 implicit type class
是否就不需要 monad transformer 了？
