---
title: hash-values
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t V)))
```

# 描述

获取哈希表的所有值，以列表形式返回。

# 例子

```scheme
(hash-values (@hash 1 2 3 4))  ;; => [2 4]
```
