---
title: set-copy
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E)))
```

# Description

Copy a set, returning a new set.

# Examples

```meta-lisp
(set-copy (@set 1 2 3))  ;; => (@set 1 2 3)
```
