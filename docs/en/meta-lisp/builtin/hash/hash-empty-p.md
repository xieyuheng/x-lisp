---
title: hash-empty?
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) bool-t))
```

# Description

Check if the hash table is empty.

# Examples

```meta-lisp
(hash-empty? (make-hash))     ;; => true
(hash-empty? (@hash 'a 1))    ;; => false
```
