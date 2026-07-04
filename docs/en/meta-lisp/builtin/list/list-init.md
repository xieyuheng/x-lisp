---
title: list-init
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

All elements of the list except the last one.

# Examples

```meta-lisp
(list-init [1 2 3])  ;; => [1 2]
(list-init [1])      ;; => []
```
