---
title: hash-put-entries
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (list-t (pair-t K V)) (hash-t K V) (hash-t K V)))
```

# 描述

将条目存入哈希表，原地修改哈希表。

# 例子

```meta-lisp
(let ((h (@hash)))
  (hash-put-entries
    [(make-pair 'a 1) (make-pair 'b 2)]
    h)
  h)
```
