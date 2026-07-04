---
title: list-find
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (maybe-t A)))
```

# Description

Find the first element satisfying the predicate, returning `(just value)` or `(nothing)`.

# Examples

```scheme
(list-find int? ['a 'b 3 'd])  ;; => (just 3)
(list-find int? ['a 'b 'c])    ;; => (nothing)
```
