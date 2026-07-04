---
title: triple-second
---

# Type

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) B))
```

# Description

Second element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-second t))  ;; => "hello"
```
