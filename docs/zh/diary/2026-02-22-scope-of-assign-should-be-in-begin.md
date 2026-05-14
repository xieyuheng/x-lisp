---
title: scope of (assign) should be in (begin)
date: 2026-02-22
---

`(assign)` 也就是 `(=)` 的 scope 应该被限制在 `(begin)` 之内，
这样解释器和类型检查器写起来就方便了，
这样也模仿了 `(let)` 的语义。
