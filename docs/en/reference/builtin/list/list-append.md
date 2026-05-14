---
title: list-append
---

# Type

```scheme
(polymorphic (A) (-> (list-t A) (list-t A) (list-t A)))
```

# Description

Concatenate two lists. Derived function.

# Examples

```scheme
(list-append [1 2 3] [4 5 6])  ;; => [1 2 3 4 5 6]
```
