---
title: list-each-index
---

# Type

```scheme
(polymorphic (A Any) (-> (-> int-t A Any) (list-t A) void-t))
```

# Description

Iterate over each element with its index, for side effects.

# Examples

```scheme
(list-each-index
 (lambda (i x)
   (print i)
   (write ": ")
   (println x))
 ['a 'b 'c])
;; Output:
;; 0: a
;; 1: b
;; 2: c
```
