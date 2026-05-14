---
title: top-level expressions
date: 2025-10-06
---

处理 top-level expressions 的方式，
是把它们解析成 `Compute` `Stmt`，
在 loading stage 的末尾，
作为可能带有 side-effect 的表达式被 evaluate。

如果表达式的 value 的类型不是 void，
就 print 这个 value。

没有命令行选项可以关闭这个 top-level print。

这样可以使得文件与 REPL 的行为相似。
