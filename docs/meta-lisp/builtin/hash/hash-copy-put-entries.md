---
title: hash-copy-put-entries
---

# Type

```meta-lisp
(all (K V) (-> (list-t (pair-t K V)) (hash-t K V) (hash-t K V)))
```

# Description

Put entries into a hash table, returning a new hash table.

# Examples

```meta-lisp
(hash-copy-put-entries
  (@list (make-pair 'a 1) (make-pair 'b 2))
  (@hash))
;; => (@hash 'a 1 'b 2)
```
