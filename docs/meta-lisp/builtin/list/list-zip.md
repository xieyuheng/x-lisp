---
title: list-zip
---

# Type

```meta-lisp
(all (A B) (-> (list-t A) (list-t B) (list-t (pair-t A B))))
```

# Description

Pair elements of two lists by position.

# Examples

```meta-lisp
(list-zip (@list 'a 'b 'c) (@list 1 2 3))   ;; => (@list (make-pair 'a 1) (make-pair 'b 2) (make-pair 'c 3))
```
