---
title: list-fold-right
---

# Type

```meta-lisp
(all (E R) (-> (list-t E) R (-> E R R) R))
```

# Description

Right fold over the list.

# Examples

```meta-lisp
(list-fold-right (@list 1 2 3 4) 0 iadd)     ;; => 10
(list-fold-right (@list 1 2 3 4) (@list) cons)    ;; => (@list 1 2 3 4)
```
