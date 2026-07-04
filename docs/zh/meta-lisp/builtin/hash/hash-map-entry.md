---
title: hash-map-entry
---

# 类型

```meta-lisp
(polymorphic (K1 V1 K2 V2)
  (-> (-> (hash-entry-t K1 V1) (hash-entry-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# 描述

对每个 entry 应用函数。

# 例子

```meta-lisp
(hash-map-entry
  (lambda (e)
    (make-hash-entry
      (iadd 1 (hash-entry-key e))
      (iadd 1 (hash-entry-value e))))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
