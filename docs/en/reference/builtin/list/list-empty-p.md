---
title: list-empty?
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) bool-t))
```

# Description

Check if the list is empty.

# Examples

```scheme
(list-empty? [])       ;; => true
(list-empty? [1 2 3])  ;; => false
```
