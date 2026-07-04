---
title: hash-from-entries
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V)))
```

# 描述

从条目列表构建哈希表。

# 例子

```meta-lisp
(hash-from-entries
  [(make-hash-entry 'a 1)
   (make-hash-entry 'b 2)])
;; => (@hash 'a 1 'b 2)
```
