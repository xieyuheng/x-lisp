---
title: list-drop
---

# Type

```scheme
(polymorphic (A) (-> int-t (list-t A) (list-t A)))
```

# Description

Drop the first `n` elements of the list. Returns an empty list if `n` exceeds the list length.

# Examples

```scheme
(list-drop 2 [1 2 3 4])  ;; => [3 4]
(list-drop 0 [1 2 3])    ;; => [1 2 3]
(list-drop 5 [1 2 3])    ;; => []
```
