---
title: list-copy
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

Copy a list, returning a new list.

# Examples

```meta-lisp
(list-copy (@list 1 2 3))  ;; => (@list 1 2 3)
```
