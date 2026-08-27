---
title: list-unzip
---

# Type

```meta-lisp
(all (A B) (-> (list-t (pair-t A B)) (pair-t (list-t A) (list-t B))))
```

# Description

Split a list of pairs into two lists.

# Examples

```meta-lisp
(list-unzip [(make-pair 'a 1) (make-pair 'b 2)])  ;; => (make-pair ['a 'b] [1 2])
```
