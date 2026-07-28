---
title: hash-put-entries-copy
---

# Type

```meta-lisp
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V) (hash-t K V)))
```

# Description

Put entries into a hash table, returning a new hash table.

# Examples

```meta-lisp
(hash-put-entries-copy
  [(make-hash-entry 'a 1) (make-hash-entry 'b 2)]
  (@hash))
;; => (@hash 'a 1 'b 2)
```
