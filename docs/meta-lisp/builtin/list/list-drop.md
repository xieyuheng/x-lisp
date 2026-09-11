---
title: list-drop
---

# Type

```meta-lisp
(all (A) (-> (list-t A) int-t (list-t A)))
```

# Description

Drop the first `n` elements of the list. Returns an empty list if `n` exceeds the list length.

# Examples

```meta-lisp
(list-drop (@list 1 2 3 4) 2)  ;; => (@list 3 4)
(list-drop (@list 1 2 3) 0)    ;; => (@list 1 2 3)
(list-drop (@list 1 2 3) 5)    ;; => (@list)
```
