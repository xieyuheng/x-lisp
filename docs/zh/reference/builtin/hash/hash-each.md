---
title: hash-each
---

# 类型

```scheme
(polymorphic (K V Any) (-> (-> K V Any) (hash-t K V) void-t))
```

# 描述

遍历每个键值对并执行副作用。

# 例子

```scheme
(= h (@hash 1 2 3 4))
(= acc [])
(hash-each (lambda (k v) (list-push! k acc) (list-push! v acc)) h)
acc  ;; => [1 2 3 4]
```
