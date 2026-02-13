---
title: back to simple type
date: 2026-02-13
---

实现作为 contract 系统的 `(claim)` 时发现：

- 只有在运行时处理带有 arrow 的函数的 apply 才行。
- 对于 return value 的 contract，会影响用 tail call 来实现循环。

所以反过来重新考虑实现 simple type，
也就是直接实现之前提出的 meta-lisp。

如若如此，现在的 runtime 已经够用了，
类型检查可以完全放在编译器前端来实现。
