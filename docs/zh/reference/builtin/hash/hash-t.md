---
title: hash-t
---

# 类型

```scheme
(-> type-t type-t type-t)
```

# 描述

哈希表类型构造器。`(hash-t K V)` 表示键类型为 `K`、值类型为 `V` 的哈希表。

# 例子

```scheme
(let ((scores (@hash "alice" 95 "bob" 87)))
  (hash-get "alice" scores))  ;; => 95
```
