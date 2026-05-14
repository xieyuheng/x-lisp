---
title: list-member?
---

# Type

```scheme
(polymorphic (A) (-> A (list-t A) bool-t))
```

# Description

Check if the list contains the given element. Derived function.

# Examples

```scheme
(list-member? 2 [1 2 3])   ;; => true
(list-member? 0 [1 2 3])   ;; => false
```
