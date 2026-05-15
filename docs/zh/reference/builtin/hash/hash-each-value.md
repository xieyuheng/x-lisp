---
title: hash-each-value
---

# 类型

```scheme
(polymorphic (K V Any) (-> (-> V Any) (hash-t K V) void-t))
```

# 描述

遍历每个值并执行副作用。

# 例子

```scheme
(let ((h (@hash 1 2 3 4))
      (acc []))
  (hash-each-value (lambda (v) (list-push! v acc)) h)
  acc)
```
