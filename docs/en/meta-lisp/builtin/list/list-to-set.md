---
title: list-to-set
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) (set-t E)))
```

# Description

Convert a list to a set, removing duplicate elements.

# Examples

```scheme
(list-to-set [1 2 2 3])  ;; => #{1 2 3}
(list-to-set [])         ;; => #{}
```
