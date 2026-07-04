---
title: list-fold-right
---

# Type

```meta-lisp
(polymorphic (E R) (-> (-> E R R) R (list-t E) R))
```

# Description

Right fold over the list.

# Examples

```meta-lisp
(list-fold-right iadd 0 [1 2 3 4])     ;; => 10
(list-fold-right cons [] [1 2 3 4])    ;; => [1 2 3 4]
```
