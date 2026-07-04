---
title: hash-get
---

# Type

```meta-lisp
(polymorphic (K V) (-> K (hash-t K V) V))
```

# Description

Get value by key. Raises an error if the key does not exist.

# Examples

```meta-lisp
(hash-get "a" (@hash "a" 1 "b" 2))  ;; => 1
;; (hash-get "c" (@hash "a" 1 "b" 2))  ;; error: key not found
```
