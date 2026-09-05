---
title: list-select
---

# Type

```meta-lisp
(all (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# Description

Filter elements that satisfy the predicate.

# Examples

```meta-lisp
(list-select int? (@list 'a 1 'b 2))       ;; => (@list 1 2)
(list-select int-non-negative? (@list 0 1 -1 2))  ;; => (@list 0 1 2)
```
