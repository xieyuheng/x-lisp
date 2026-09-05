---
title: list-fold-right
---

# Type

```meta-lisp
(all (E R) (-> (-> E R R) R (list-t E) R))
```

# Description

Right fold over the list.

# Examples

```meta-lisp
(list-fold-right iadd 0 (@list 1 2 3 4))     ;; => 10
(list-fold-right cons (@list) (@list 1 2 3 4))    ;; => (@list 1 2 3 4)
```
