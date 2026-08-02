---
title: hash-copy-put
---

# Type

```meta-lisp
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# Description

Set a key-value pair, returning a new hash table.

# Examples

```meta-lisp
(hash-copy-put "c" 3 (@hash "a" 1 "b" 2))  ;; => (@hash "a" 1 "b" 2 "c" 3)
```
