---
title: hash-has
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) K bool-t))
```

# Description

Check if the hash table contains the given key.

# Examples

```meta-lisp
(hash-has (@hash "a" 1 "b" 2) "a")  ;; => true
(hash-has (@hash "a" 1 "b" 2) "c")  ;; => false
```
