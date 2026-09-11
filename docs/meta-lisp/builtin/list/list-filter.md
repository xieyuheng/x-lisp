---
title: list-filter
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (-> A bool-t) (list-t A)))
```

# Description

Filter elements that satisfy the predicate.

# Examples

```meta-lisp
(list-filter (@list 'a 1 'b 2) int?)       ;; => (@list 1 2)
(list-filter (@list 0 1 -1 2) int-non-negative?)  ;; => (@list 0 1 2)
```
