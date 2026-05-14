---
title: list-map
---

# Type

```scheme
(polymorphic (A B) (-> (-> A B) (list-t A) (list-t B)))
```

# Description

Apply a function to each element of the list, returning a new list. Derived function.

# Examples

```scheme
(list-map (iadd 10) [1 2 3])  ;; => [11 12 13]
(list-map string? [1 "a" 3])  ;; => [false true false]
```
