---
title: should not encode type in value
date: 2026-05-12
---

不要用 value 来 encode type，
这样就不需要对 exp 的 evaluate 了，
也不需要再编译器中定义 value-t 了，
就没有 meta-circular evaluator 的问题了。

对于简单的类型系统而言，
meta-circular evaluator 是个伪需求。
