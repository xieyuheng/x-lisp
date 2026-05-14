---
title: set-select
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# Description

Filter elements that satisfy the predicate. Derived function.

# Examples

```scheme
(set-select int-non-negative? #{-2 -1 0 1 2})  ;; => #{0 1 2}
```
