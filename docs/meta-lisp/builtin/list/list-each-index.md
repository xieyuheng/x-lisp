---
title: list-each-index
---

# Type

```meta-lisp
(all (A Any) (-> (list-t A) (-> int-t A Any) void-t))
```

# Description

Iterate over each element with its index, for side effects.

# Examples

```meta-lisp
(list-each-index
 (@list 'a 'b 'c)
 (lambda (i x)
   (print i)
   (write ": ")
   (println x)))
;; Output:
;; 0: a
;; 1: b
;; 2: c
```
