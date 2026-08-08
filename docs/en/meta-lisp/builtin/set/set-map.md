---
title: set-map
---

# Type

```meta-lisp
(all (A B) (-> (-> A B) (set-t A) (set-t B)))
```

# Description

Apply a function to each element of the set, returning a new set.

# Examples

```meta-lisp
(set-map (lambda (n) (iadd n n)) (@set 1 2 3))  ;; => (@set 2 4 6)
```
