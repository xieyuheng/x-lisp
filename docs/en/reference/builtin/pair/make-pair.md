---
title: make-pair
---

# Type

```scheme
(polymorphic (A B) (-> A B (pair-t A B)))
```

# Description

Constructor of `pair-t`, constructs a pair with two values.

# Examples

```scheme
(make-pair 1 "hello")   ;; => (1 . "hello")
(make-pair "a" "b")     ;; => ("a" . "b")
```
