---
title: for-hash-value
---

# 类型

```meta-lisp
(polymorphic (K V Any) (-> (hash-t K V) (-> V Any) void-t))
```

# 描述

`for-hash-value` 是 `hash-each-value` 的 data-first 版本。
等价于 `(hash-each-value fn data)`。

遍历哈希表中每个值并执行副作用。

# 例子

```meta-lisp
(for-hash-value (@hash 1 2 3 4) println)
```
