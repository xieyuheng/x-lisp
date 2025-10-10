---
title: tael and reader
date: 2025-09-14
---

在考虑是否要增加 x-sexp 的语法来表达 set。
回想到 x-sexp 中 tael 与 reader 的问题，
现在讨论一下，看看会不会影响 set 的语法设计。

当 reader 读到 `[...]` 时，会把它翻译为 `(tael ...)`，
这类似于读到 `'symbol` 是，翻译为 `(quote symbol)`，
这样可以保持核心语法中可以只有 sexp 的 atom 和 list。

我对 tael 的用法类似于 scheme 的 `(list ...)`，
我不用 `list` 是因为不想占用这个常用的变量名字，
而导致人们想用这个名字的时候都不得不缩写以躲避这个语法关键词。
类似的我们也不应该占用 `set` 这个变量名字。

假设我们不将 `[...]` 翻译为 `(tael ...)` 会有什么后果？
后果是 reader 读 sexp 的时候，没法区分 `[a b c]` 与 `(a b c)`。

那么我们需要为 set 设计类似的机制吗？
好像不需要，因为 set 与 tael 完全不同，
tael 的特殊性在于 quoted sexp 会被翻译为 tael value，
而 set value 是独立于 sexp 的 value。

如果没有对 tael 的翻译，就没法区分 `[a b c]` 与 `(a b c)`，
是因为 `'(a b c)` 会被求值为 `['a 'b 'c]`。
由于已有的 sexp 不会与 set 相互影响。
