---
title: hash-map
---

# 类型

```meta-lisp
(polymorphic (K1 V1 K2 V2)
  (-> (-> K1 V1 (pair-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# 描述

对键和值应用函数，产生新的 entry。

# 例子

```meta-lisp
(hash-map
  (lambda (k v) (make-pair (iadd 1 k) (iadd 1 v)))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
