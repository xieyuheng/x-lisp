---
title: list-fold-left
---

# Type

```meta-lisp
(all (E R) (-> (-> R E R) R (list-t E) R))
```

# Description

Left fold over the list.

# Examples

```meta-lisp
(list-fold-left iadd 0 (@list 1 2 3 4))          ;; => 10
(list-fold-left (swap cons) (@list) (@list 1 2 3 4))  ;; => (@list 4 3 2 1)
```
