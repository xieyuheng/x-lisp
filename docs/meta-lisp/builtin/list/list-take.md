---
title: list-take
---

# Type

```meta-lisp
(all (A) (-> (list-t A) int-t (list-t A)))
```

# Description

Take the first `n` elements of the list. Returns the whole list if `n` exceeds the list length.

# Examples

```meta-lisp
(list-take (@list 1 2 3 4) 2)  ;; => (@list 1 2)
(list-take (@list 1 2 3) 0)    ;; => (@list)
(list-take (@list 1 2 3) 5)    ;; => (@list 1 2 3)
```
