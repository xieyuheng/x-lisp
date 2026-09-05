---
title: list-map
---

# Type

```meta-lisp
(all (A B) (-> (-> A B) (list-t A) (list-t B)))
```

# Description

Apply a function to each element of the list, returning a new list.

# Examples

```meta-lisp
(list-map (iadd 10) (@list 1 2 3))  ;; => (@list 11 12 13)
(list-map text? (@list 1 "a" 3))  ;; => (@list false true false)
```
