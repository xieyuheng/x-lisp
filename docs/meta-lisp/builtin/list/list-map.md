---
title: list-map
---

# Type

```meta-lisp
(all (A B) (-> (list-t A) (-> A B) (list-t B)))
```

# Description

Apply a function to each element of the list, returning a new list.

# Examples

```meta-lisp
(list-map (@list 1 2 3) (iadd 10))  ;; => (@list 11 12 13)
(list-map (@list 1 "a" 3) text?)  ;; => (@list false true false)
```
