---
title: hashtag and self-evaluating value
date: 2025-09-23
---

在再次尝试融合 symbol 和 string 的过程中，
发现有必要让 string 独立于 symbol，
因为要保持 string 为 self-evaluating value。

为了有统一的方式来实现 `#t #f #null #void`，
并且保持它们都是 self-evaluating value。
给 x-sexp 增加了 hashtag 这个数据类型。
