---
title: hash-has
---

# Type

```meta-lisp
(all (K V) (-> K (hash-t K V) bool-t))
```

# Description

Check if the hash table contains the given key.

# Examples

```meta-lisp
(hash-has "a" (@hash "a" 1 "b" 2))  ;; => true
(hash-has "c" (@hash "a" 1 "b" 2))  ;; => false
```
