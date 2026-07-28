---
title: list-sort-copy
---

# Type

```meta-lisp
(polymorphic (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# Description

Sort a copy of the list using a comparator function. The original list is not modified.

# Examples

```meta-lisp
;; int
(list-sort-copy int-compare-ascending [3 1 2])    ;; => [1 2 3]
(list-sort-copy int-compare-descending [3 1 2])   ;; => [3 2 1]

;; float
(list-sort-copy float-compare-ascending [3.0 1.0 2.0])   ;; => [1.0 2.0 3.0]
(list-sort-copy float-compare-descending [3.0 1.0 2.0])  ;; => [3.0 2.0 1.0]

;; string
(list-sort-copy string-compare-lexical ["c" "a" "b"])     ;; => ["a" "b" "c"]
```
