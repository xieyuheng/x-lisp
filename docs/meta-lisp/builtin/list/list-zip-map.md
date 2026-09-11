---
title: list-zip-map
---

# Type

```meta-lisp
(all (A B C) (-> (list-t A) (list-t B) (-> A B C) (list-t C)))
```

# Description

Combine two lists element-wise using a function.

# Examples

```meta-lisp
(list-zip-map (@list 1 2 3) (@list 10 20 30) iadd)  ;; => (@list 11 22 33)
```
