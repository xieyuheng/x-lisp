---
title: list-get
---

# Type

```meta-lisp
(all (E) (-> int-t (list-t E) E))
```

# Description

Get element by index, starting from 0.

# Examples

```meta-lisp
(list-get 0 (@list 1 2 3))  ;; => 1
(list-get 2 (@list 1 2 3))  ;; => 3
```
