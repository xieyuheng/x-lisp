---
title: triple-second
---

# Type

```scheme
(polymorphic (A B C) (-> (triple-t A B C) B))
```

# Description

Second element of a triple.

# Examples

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-second t))  ;; => "hello"
```
