---
title: list-length
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) int-t))
```

# Description

Number of elements in the list.

# Examples

```scheme
(list-length [1 2 3])  ;; => 3
(list-length [])       ;; => 0
```
