---
title: set-to-list
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (list-t E)))
```

# Description

Convert a set to a list.

# Examples

```scheme
(set-to-list #{1 2 3})  ;; => [1 2 3]
(set-to-list #{})       ;; => []
```
