---
title: triple-third
---

# Type

```scheme
(polymorphic (A B C) (-> (triple-t A B C) C))
```

# Description

Third element of a triple.

# Examples

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-third t))  ;; => true
```
