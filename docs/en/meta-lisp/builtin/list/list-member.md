---
title: list-member
---

# Type

```meta-lisp
(polymorphic (A) (-> A (list-t A) bool-t))
```

# Description

Check if the list contains the given element.

# Examples

```meta-lisp
(list-member 2 [1 2 3])   ;; => true
(list-member 0 [1 2 3])   ;; => false
```
