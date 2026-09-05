---
title: cons
---

# Type

```meta-lisp
(all (E) (-> E (list-t E) (list-t E)))
```

# Description

Prepend an element at the front of the list.

# Examples

```meta-lisp
(cons 1 (@list 2 3))    ;; => (@list 1 2 3)
(cons "a" (@list))     ;; => (@list "a")
```
