---
title: list-sort!
---

# Type

```meta-lisp
(polymorphic (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# Description

Sort the list in-place using a comparator function. Returns the same list.

# Examples

```meta-lisp
;; int
(list-sort! int-compare-ascending [3 1 2])   ;; => [1 2 3]
(list-sort! int-compare-descending [3 1 2])  ;; => [3 2 1]

;; float
(list-sort! float-compare-ascending [3.0 1.0 2.0])   ;; => [1.0 2.0 3.0]
(list-sort! float-compare-descending [3.0 1.0 2.0])  ;; => [3.0 2.0 1.0]

;; string
(list-sort! string-compare-lexical ["c" "a" "b"])     ;; => ["a" "b" "c"]
```
