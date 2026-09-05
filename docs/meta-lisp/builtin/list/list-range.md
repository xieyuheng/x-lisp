---
title: list-range
---

# Type

```meta-lisp
(-> int-t (list-t int-t))
```

# Description

Generate a list of integers from 0 to n - 1.

# Examples

```meta-lisp
(list-range 0)  ;; => (@list)
(list-range 3)  ;; => (@list 0 1 2)
(list-range 5)  ;; => (@list 0 1 2 3 4)
```
