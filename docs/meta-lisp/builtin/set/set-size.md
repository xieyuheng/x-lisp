---
title: set-size
---

# Type

```meta-lisp
(all (E) (-> (set-t E) int-t))
```

# Description

Number of elements in the set.

# Examples

```meta-lisp
(set-size (@set 1 2 3))  ;; => 3
(set-size (@set))       ;; => 0
```
