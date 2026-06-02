---
title: triple-put-third!
---

# Type

```scheme
(polymorphic (A B C) (-> C (triple-t A B C) (triple-t A B C)))
```

# Description

Replace the third element of a triple.

# Examples

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-third! #f t)
  (triple-third t))  ;; => false
```
