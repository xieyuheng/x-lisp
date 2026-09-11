---
title: array-sort
---

# Type

```meta-lisp
(all (E) (-> (array-t E) (-> E E int-t) void-t))
```

# Description

Sort the array in-place using a comparator function.

# Examples

```meta-lisp
(let ((a (@array 3 1 2)))
  (array-sort a int-compare-ascending)
  a)
;; => (@array 1 2 3)
```
