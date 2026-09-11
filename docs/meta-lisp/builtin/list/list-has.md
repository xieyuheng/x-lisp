---
title: list-has
---

# Type

```meta-lisp
(all (A) (-> (list-t A) A bool-t))
```

# Description

Check if the list contains the given element.

# Examples

```meta-lisp
(list-has (@list 1 2 3) 2)   ;; => true
(list-has (@list 1 2 3) 0)   ;; => false
```
