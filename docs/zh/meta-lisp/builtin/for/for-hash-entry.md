---
title: for-hash-entry
---

# 类型

```meta-lisp
(polymorphic (K V Any) (-> (hash-t K V) (-> (hash-entry-t K V) Any) void-t))
```

# 描述

`for-hash-entry` 是 `hash-each-entry` 的 data-first 版本。
等价于 `(hash-each-entry fn data)`。

遍历哈希表中每个条目并执行副作用。

# 例子

```meta-lisp
(for-hash-entry (@hash 1 2 3 4) println)
```
