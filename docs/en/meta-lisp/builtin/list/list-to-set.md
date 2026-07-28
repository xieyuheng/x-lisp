---
title: list-to-set
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) (set-t E)))
```

# Description

Convert a list to a set, removing duplicate elements.

# Examples

```meta-lisp
(list-to-set [1 2 2 3])  ;; => (@set 1 2 3)
(list-to-set [])         ;; => (@set)
```
