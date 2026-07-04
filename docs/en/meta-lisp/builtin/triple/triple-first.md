---
title: triple-first
---

# Type

```scheme
(polymorphic (A B C) (-> (triple-t A B C) A))
```

# Description

First element of a triple.

# Examples

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))  ;; => 1
```
