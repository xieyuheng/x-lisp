---
title: set-reject
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# Description

Remove elements that satisfy the predicate.

# Examples

```scheme
(set-reject int-non-negative? #{-2 -1 0 1 2})  ;; => #{-2 -1}
```
