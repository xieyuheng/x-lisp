---
title: hash-copy-put-entries
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (list-t (pair-t K V)) (hash-t K V) (hash-t K V)))
```

# 描述

将条目存入哈希表，返回新的哈希表。

# 例子

```meta-lisp
(hash-copy-put-entries
  [(make-pair 'a 1) (make-pair 'b 2)]
  (@hash))
;; => (@hash 'a 1 'b 2)
```
