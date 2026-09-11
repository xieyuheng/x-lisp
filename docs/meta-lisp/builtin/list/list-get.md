---
title: list-get
---

# Type

```meta-lisp
(all (E) (-> (list-t E) int-t E))
```

# Description

Get element by index, starting from 0.

# Examples

```meta-lisp
(list-get (@list 1 2 3) 0)  ;; => 1
(list-get (@list 1 2 3) 2)  ;; => 3
```
