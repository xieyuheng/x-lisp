---
title: hash-put
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) K V (hash-t K V)))
```

# Description

Set a key-value pair, same as `hash-copy-put`.

# Examples

```meta-lisp
(let ((h (@hash "a" 1)))
  (hash-put h "b" 2)
  h)
;; => (@hash "a" 1 "b" 2)
```
