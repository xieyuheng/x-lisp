---
title: list-member
---

# Type

```meta-lisp
(all (A) (-> A (list-t A) bool-t))
```

# Description

Check if the list contains the given element.

# Examples

```meta-lisp
(list-member 2 (@list 1 2 3))   ;; => true
(list-member 0 (@list 1 2 3))   ;; => false
```
