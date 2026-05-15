---
title: hash-length
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) int-t))
```

# 描述

返回哈希表中键值对的数量。

# 例子

```scheme
(let ((h (@hash "a" 1)))
  (hash-length h))  ;; => 1
```
