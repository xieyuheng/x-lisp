---
title: hash-each-entry
---

# 类型

```scheme
(polymorphic (K V Any) (-> (-> (hash-entry-t K V) Any) (hash-t K V) void-t))
```

# 描述

遍历每个 entry 并执行副作用。

# 例子

```scheme
(= h (@hash 1 2 3 4))
(= acc [])
(hash-each-entry (lambda (e) (list-push! e acc)) h)
acc  ;; => [(make-hash-entry 1 2) (make-hash-entry 3 4)]
```
