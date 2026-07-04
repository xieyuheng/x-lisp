---
title: list-fold-left
---

# Type

```scheme
(polymorphic (E R) (-> (-> R E R) R (list-t E) R))
```

# Description

Left fold over the list.

# Examples

```scheme
(list-fold-left iadd 0 [1 2 3 4])          ;; => 10
(list-fold-left (swap cons) [] [1 2 3 4])  ;; => [4 3 2 1]
```
