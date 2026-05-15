---
title: hash-each-key
---

# 类型

```scheme
(polymorphic (K V Any) (-> (-> K Any) (hash-t K V) void-t))
```

# 描述

遍历每个键并执行副作用。

# 例子

```scheme
(let ((h (@hash 1 2 3 4))
      (acc []))
  (hash-each-key (lambda (k) (list-push! k acc)) h)
  acc)
```
