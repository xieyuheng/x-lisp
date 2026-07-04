---
title: list-reject
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# Description

Remove elements that satisfy the predicate.

# Examples

```meta-lisp
(list-reject int? ['a 1 'b 2])       ;; => ['a 'b]
(list-reject int-non-negative? [0 1 -1 2])  ;; => [-1]
```
