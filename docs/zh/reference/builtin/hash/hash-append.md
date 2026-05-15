---
title: hash-append
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) (hash-t K V) (hash-t K V)))
```

# 描述

合并两个哈希表，键冲突时 `rest` 优先。

# 例子

```scheme
(hash-append (@hash 1 2) (@hash 3 4))
;; => (@hash 1 2 3 4)

(hash-append (@hash 1 2 3 5) (@hash 3 4))
;; => (@hash 1 2 3 4)
```
