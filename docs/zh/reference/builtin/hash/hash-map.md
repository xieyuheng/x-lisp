---
title: hash-map
---

# 类型

```scheme
(polymorphic (K1 V1 K2 V2)
  (-> (-> K1 V1 (hash-entry-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# 描述

对键和值应用函数，产生新的 entry。

# 例子

```scheme
(hash-map
  (lambda (k v) (make-hash-entry (iadd 1 k) (iadd 1 v)))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
