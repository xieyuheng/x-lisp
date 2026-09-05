---
title: list-is-empty
---

# Type

```meta-lisp
(all (E) (-> (list-t E) bool-t))
```

# Description

Check if the list is empty.

# Examples

```meta-lisp
(list-is-empty (@list))       ;; => true
(list-is-empty (@list 1 2 3))  ;; => false
```
