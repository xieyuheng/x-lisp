---
title: for-hash
---

# 类型

```scheme
(polymorphic (K V Any) (-> (hash-t K V) (-> K V Any) void-t))
```

# 描述

`for-hash` 是 `hash-each` 的 data-first 版本。
等价于 `(hash-each fn data)`。

遍历哈希表中每个键值对并执行副作用。

# 例子

```scheme
(for-hash (@hash 1 2 3 4)
  (lambda (key value)
    (println key)
    (println value)))
```
