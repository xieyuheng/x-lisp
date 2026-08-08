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
(list-zip ['a 'b 'c] [1 2 3])   ;; => [(make-pair 'a 1) (make-pair 'b 2) (make-pair 'c 3)]
```
