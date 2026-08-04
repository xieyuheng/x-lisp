---
title: hash-map-entry
---

# 类型

```meta-lisp
(polymorphic (K1 V1 K2 V2)
  (-> (-> (pair-t K1 V1) (pair-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# 描述

对每个 entry 应用函数。

# 例子

```meta-lisp
(hash-map-entry
  (lambda (e)
    (make-pair
      (iadd 1 (pair-first e))
      (iadd 1 (pair-second e))))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
