---
title: triple-put-third!
---

# Type

```meta-lisp
(polymorphic (A B C) (-> C (triple-t A B C) (triple-t A B C)))
```

# Description

Replace the third element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-third! #f t)
  (triple-third t))  ;; => false
```
