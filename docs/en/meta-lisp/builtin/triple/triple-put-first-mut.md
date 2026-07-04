---
title: triple-put-first!
---

# Type

```meta-lisp
(polymorphic (A B C) (-> A (triple-t A B C) (triple-t A B C)))
```

# Description

Replace the first element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-first! 7 t)
  (triple-first t))  ;; => 7
```
