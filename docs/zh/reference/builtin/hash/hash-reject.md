---
title: hash-reject
---

# 类型

```scheme
(polymorphic (K V) (-> (-> K V bool-t) (hash-t K V) (hash-t K V)))
```

# 描述

移除谓词返回真的条目。

# 例子

```scheme
(hash-reject
  (lambda (k v) (int-non-negative? v))
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'x -1 'y -2)
```
