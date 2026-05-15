---
title: hash-put-entries!
---

# 类型

```scheme
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V) (hash-t K V)))
```

# 描述

将条目存入哈希表，原地修改哈希表。

# 例子

```scheme
(= h (@hash))
(hash-put-entries!
  [(make-hash-entry 'a 1) (make-hash-entry 'b 2)]
  h)
h  ;; => (@hash 'a 1 'b 2)
```
