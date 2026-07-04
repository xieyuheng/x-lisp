---
title: hash-select
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (-> K V bool-t) (hash-t K V) (hash-t K V)))
```

# 描述

保留谓词返回真的条目。

# 例子

```meta-lisp
(hash-select
  (lambda (k v) (int-non-negative? v))
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'a 1 'b 2)
```
