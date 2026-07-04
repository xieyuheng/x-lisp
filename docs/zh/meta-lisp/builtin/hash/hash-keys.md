---
title: hash-keys
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t K)))
```

# 描述

获取哈希表的所有键，以列表形式返回。

# 例子

```scheme
(let ((h (@hash 1 2 3 4)))
  (list-map (iadd 1) (hash-keys h)))  ;; => [2 4]
```
