---
title: comment and code formatting
date: 2025-10-09
---

实现了对 value 的 pretty print 之后，
想要顺便实现一下 code formatting。
但是发现不能马上实现，因为注释的问题。

如果是在 exp 和 stmt 上做 pretty print
来是实现 code formatting，
就会失去注释，因为 exp 和 stmt 不带注释。

因此正确的实现方式是，让 sexp 带有注释，
把注释都翻译成 sexp 节点。

解析 exp 的时候，先删除 sexp 中的注释，再解析。

code format 要在 sexp 层次来做，
而不是在 exp 和 stmt 层次来做。
