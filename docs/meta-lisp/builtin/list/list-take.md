---
title: list-take
---

# Type

```meta-lisp
(all (A) (-> int-t (list-t A) (list-t A)))
```

# Description

Take the first `n` elements of the list. Returns the whole list if `n` exceeds the list length.

# Examples

```meta-lisp
(list-take 2 (@list 1 2 3 4))  ;; => (@list 1 2)
(list-take 0 (@list 1 2 3))    ;; => (@list)
(list-take 5 (@list 1 2 3))    ;; => (@list 1 2 3)
```
