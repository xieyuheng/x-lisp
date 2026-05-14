---
title: list-group
---

# 类型

```scheme
(polymorphic (K V) (-> (-> V K) (list-t V) (hash-t K (list-t V))))
```

# 描述

按 key 函数对列表进行分组，返回哈希表。派生函数。

# 例子

```scheme
(list-group (swap imod 3) [0 1 2 3 4 5])
;; => (@hash 0 [0 3] 1 [1 4] 2 [2 5])
```
