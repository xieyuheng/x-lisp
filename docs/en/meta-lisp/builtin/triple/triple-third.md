---
title: triple-third
---

# Type

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) C))
```

# Description

Third element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-third t))  ;; => true
```
