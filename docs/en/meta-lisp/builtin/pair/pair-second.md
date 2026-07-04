---
title: pair-second
---

# Type

```scheme
(polymorphic (A B) (-> (pair-t A B) B))
```

# Description

Second element of a pair.

# Examples

```scheme
(let ((p (make-pair 1 "hello")))
  (pair-second p))  ;; => "hello"
```
