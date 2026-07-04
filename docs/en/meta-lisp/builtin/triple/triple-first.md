---
title: triple-first
---

# Type

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) A))
```

# Description

First element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))  ;; => 1
```
