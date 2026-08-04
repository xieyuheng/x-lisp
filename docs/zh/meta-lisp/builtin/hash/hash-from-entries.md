---
title: hash-from-entries
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (list-t (pair-t K V)) (hash-t K V)))
```

# 描述

从条目列表构建哈希表。

# 例子

```meta-lisp
(hash-from-entries
  [(make-pair 'a 1)
   (make-pair 'b 2)])
;; => (@hash 'a 1 'b 2)
```
