---
title: cdr
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element.

# Examples

```scheme
(cdr [1 2 3])   ;; => [2 3]
(cdr [1])       ;; => []
```
