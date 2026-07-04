---
title: set-size
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) int-t))
```

# Description

Number of elements in the set.

# Examples

```scheme
(set-size #{1 2 3})  ;; => 3
(set-size #{})       ;; => 0
```
