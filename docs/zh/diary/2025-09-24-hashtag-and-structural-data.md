---
title: hashtag and structural data
date: 2025-09-24
---

有了 hashtag 这个数据类型之后，
可以把现在的 nominal `define-data` 改成 structural。

也就是说 data constructor 不再返回全新的数据类型，
而是返回 head 是 hashtag 的 tael。

这样设计的缺点：

- 没法用 `define-data` 来构造全新的，
  与已有的所有数据都不同的数据类型了。

这样设计的优点：

- 同名的 data constructor 如果定义了不相等的数据类型，
  会让人们疑惑，我之前遇到了这种情况，debug 了好久。

- 这样所有的数据都是 structural data，
  就可以无损地保存下来，或者通过网络传递等等。

- 不同版本的 module 中可能有相同的 data constructor，
  如果使用 nominal data，它们所构造的 data 是不相等的。
  改成 structural data 就没有这个问题了。
