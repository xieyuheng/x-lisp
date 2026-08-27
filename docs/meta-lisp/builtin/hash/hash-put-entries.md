---
title: hash-put-entries
---

# Type

```meta-lisp
(all (K V) (-> (list-t (pair-t K V)) (hash-t K V) (hash-t K V)))
```

# Description

Put entries into a hash table, mutating the hash table in place.

# Examples

```meta-lisp
(let ((h (@hash)))
  (hash-put-entries
    [(make-pair 'a 1) (make-pair 'b 2)]
    h)
  h)
```
