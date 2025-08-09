---
title: context sensitive pattern matching
date: 2025-08-09
---

模式匹配的语法中的「模式」可能有两种设计方式。

一种是 context free，
要求所有的 pattern 都必须是 `(<constructor> <pattern-var> ...)`，
就算是没有参数的 `nil` 也必须写成 `(nil)`。
一个 symbol 是否是 `<pattern-var>`
完全由它在表达式中出现的局部位置所决定。

另一中 context sensitive，
其中有可能出现 `(<constructor> <pattern-var> <constructor> ...)`，
比如 `(li x (li y nil))`，其中只有 `x` 和 `y` 是 `<pattern-var>`。

我们目前所实现的是这种 context sensitive 的 pattern matching。

在语法解析时，可以先把 pattern 位置的表达式解析成 `Exp`，
然后再用类似 `evaluate` 的函数把 `Exp` 在当前 context 中转化为 pattern。
类似的函数可以叫做 "patternize" 或 "patternify"。
