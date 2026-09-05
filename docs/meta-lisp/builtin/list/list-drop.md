---
title: list-drop
---

# Type

```meta-lisp
(all (A) (-> int-t (list-t A) (list-t A)))
```

# Description

Drop the first `n` elements of the list. Returns an empty list if `n` exceeds the list length.

# Examples

```meta-lisp
(list-drop 2 (@list 1 2 3 4))  ;; => (@list 3 4)
(list-drop 0 (@list 1 2 3))    ;; => (@list 1 2 3)
(list-drop 5 (@list 1 2 3))    ;; => (@list)
```
