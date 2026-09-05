---
title: list-reject
---

# Type

```meta-lisp
(all (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# Description

Remove elements that satisfy the predicate.

# Examples

```meta-lisp
(list-reject int? (@list 'a 1 'b 2))       ;; => (@list 'a 'b)
(list-reject int-non-negative? (@list 0 1 -1 2))  ;; => (@list -1)
```
