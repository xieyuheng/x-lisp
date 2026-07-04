---
title: list-empty?
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) bool-t))
```

# Description

Check if the list is empty.

# Examples

```meta-lisp
(list-empty? [])       ;; => true
(list-empty? [1 2 3])  ;; => false
```
