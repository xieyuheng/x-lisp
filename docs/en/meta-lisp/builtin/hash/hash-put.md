---
title: hash-put
---

# Type

```meta-lisp
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# Description

Set a key-value pair, same as `hash-put-copy`.

# Examples

```meta-lisp
(let ((h (@hash "a" 1)))
  (hash-put "b" 2 h)
  h)
;; => (@hash "a" 1 "b" 2)
```
