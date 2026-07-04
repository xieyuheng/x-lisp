---
title: for-hash-key
---

# 类型

```scheme
(polymorphic (K V Any) (-> (hash-t K V) (-> K Any) void-t))
```

# 描述

`for-hash-key` 是 `hash-each-key` 的 data-first 版本。
等价于 `(hash-each-key fn data)`。

遍历哈希表中每个键并执行副作用。

# 例子

```scheme
(for-hash-key (@hash 1 2 3 4) println)
```
