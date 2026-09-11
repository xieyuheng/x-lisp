---
title: array-push
---

# Type

```meta-lisp
(all (E) (-> (array-t E) E void-t))
```

# Description

Append an element at the end in-place.

# Examples

```meta-lisp
(let ((a (make-array)))
  (array-push a 1)
  (array-push a 2)
  a)
;; => (@array 1 2)
```
