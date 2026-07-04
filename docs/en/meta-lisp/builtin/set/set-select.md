---
title: set-select
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# Description

Filter elements that satisfy the predicate.

# Examples

```meta-lisp
(set-select int-non-negative? #{-2 -1 0 1 2})  ;; => #{0 1 2}
```
