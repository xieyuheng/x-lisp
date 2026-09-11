---
title: array-put
---

# Type

```meta-lisp
(all (E) (-> (array-t E) int-t E void-t))
```

# Description

Replace the element at index in-place.

# Examples

```meta-lisp
(let ((a (@array 1 2 3)))
  (array-put a 0 9)
  a)
;; => (@array 9 2 3)
```
