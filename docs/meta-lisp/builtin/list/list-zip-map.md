---
title: list-zip-map
---

# Type

```meta-lisp
(all (A B C) (-> (-> A B C) (list-t A) (list-t B) (list-t C)))
```

# Description

Combine two lists element-wise using a function.

# Examples

```meta-lisp
(list-zip-map iadd (@list 1 2 3) (@list 10 20 30))  ;; => (@list 11 22 33)
```
