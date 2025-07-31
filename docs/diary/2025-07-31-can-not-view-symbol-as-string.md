---
title: can not view symbol as string
date: 2025-07-31
---

本身一种简化整个语言的方式是把 symbol 当作 string，
但是我发现不能这样做。

因为这样做就需要我们把 `"abc"` 理解为 `'abc`，
此时 `'abc` 可以被 parser 展开成 `(quote abc)`，
尽管 `"abc"` 也可以被 parser 展开成 `(quote abc)`，
但是 `"a b c"` 没法被 parser 展开成任何东西，
比如单开成 `(quote "a b c")` 是不对的。
