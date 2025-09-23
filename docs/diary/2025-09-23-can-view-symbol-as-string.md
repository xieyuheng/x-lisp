---
title: can view symbol as string
date: 2025-09-23
---

之前认为
[can NOT view symbol as string](2025-07-31-can-not-view-symbol-as-string.md)。

如果区分 symbol 和 string 这两种 sexp value，
就可以让 symbol 代表 identifier，
让 string 代表 literal string。

如果不区分 symbol 和 string，
我们还是想让写作 symbol 的 string 代表 identifier，
让 string 代表 literal string。

写作 symbol 的 string 作为 identifier 的实现方式是：

- 直接出现的 symbol 代表 identifier。
- 带有 quote 的 symbol `'abc` 翻译成 `(@quote abc)`，
  在 evaluate 时被求值成 string。。

string 代表 literal string 的实现方式是：

- 把 `"hello world"` 翻译成 `(@quote "hello world")`，
  在 evaluate 时被求值成 string。
- 包含空格的 string 不能作为 identifier。

打印 string 的时候：

- 如果 string 包含空字符（空格和换行等），
  就打印成双引号的 literal string。

- 如果 string 不包含空字符，
  就直接打印成单引号的 literal symbol。

还是可以有 symbol 这个概念，
但是此时它只是代表不包含空字符的 string。

我发现，在引入 literal set
并且给 literal 语法增加 `@` 前缀之后，
语法设计的框架更清晰了。

所谓「语法设计的框架」，
就是应该维持哪些一致性，
应该放弃哪些一致性。
