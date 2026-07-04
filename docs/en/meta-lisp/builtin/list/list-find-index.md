---
title: list-find-index
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) int-t))
```

# Description

Find the index of the first element satisfying the predicate. Returns `-1` if not found.

# Examples

```scheme
(list-find-index int? ['a 'b 3 'd])  ;; => 2
(list-find-index int? ['a 'b 'c])    ;; => -1
```
