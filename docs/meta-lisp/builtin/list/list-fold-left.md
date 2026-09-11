---
title: list-fold-left
---

# Type

```meta-lisp
(all (E R) (-> (list-t E) R (-> R E R) R))
```

# Description

Left fold over the list.

# Examples

```meta-lisp
(list-fold-left (@list 1 2 3 4) 0 iadd)          ;; => 10
(list-fold-left (@list 1 2 3 4) (@list) (swap cons))  ;; => (@list 4 3 2 1)
```
