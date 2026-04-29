---
title: quit using subscript
date: 2026-04-30
---

之前让生成的 variable name 带有 subscript，比如 `x₁`。

但是由于所生成的 subscript 之间没有间隔符号，所以这样不安全，
比如 `x₁₃` 可能其实应该代表 `x.1.3`。

所以还是用 `x.1` 这种格式来生成 variable name。

这也是 minikanren 所用的格式，
minikanren 在书中打印时用的是 `_₁`，
但是实际在代码中用的是 `_.1`。
