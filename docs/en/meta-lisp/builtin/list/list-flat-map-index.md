---
title: list-flat-map-index
---

# Type

```meta-lisp
(polymorphic (A B) (-> (-> int-t A (list-t B)) (list-t A) (list-t B)))
```

# Description

Map a function over each element together with its index, then flatten the results by one level.

# Examples

```meta-lisp
(list-flat-map-index (lambda (i x) [i x]) [10 20 30])
;; => [0 10 1 20 2 30]

(list-flat-map-index (lambda (i x) [(make-pair i x) (make-pair i x)]) ['a 'b 'c])
;; => [(make-pair 0 'a) (make-pair 0 'a) (make-pair 1 'b) (make-pair 1 'b) (make-pair 2 'c) (make-pair 2 'c)]
```
