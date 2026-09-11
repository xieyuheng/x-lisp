---
title: set-map
---

# Type

```meta-lisp
(all (A B) (-> (set-t A) (-> A B) (set-t B)))
```

# Description

Apply a function to each element of the set, returning a new set.

# Examples

```meta-lisp
(set-map (@set 1 2 3) (lambda (n) (iadd n n)))  ;; => (@set 2 4 6)
```
