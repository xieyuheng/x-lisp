---
title: hash-is-empty
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) bool-t))
```

# Description

Check if the hash table is empty.

# Examples

```meta-lisp
(hash-is-empty (make-hash))     ;; => true
(hash-is-empty (@hash 'a 1))    ;; => false
```
