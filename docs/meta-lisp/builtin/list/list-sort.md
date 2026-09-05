---
title: list-sort
---

# Type

```meta-lisp
(all (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# Description

Sort the list in-place using a comparator function. Returns the same list.

# Examples

```meta-lisp
;; int
(list-sort int-compare-ascending (@list 3 1 2))   ;; => (@list 1 2 3)
(list-sort int-compare-descending (@list 3 1 2))  ;; => (@list 3 2 1)

;; float
(list-sort float-compare-ascending (@list 3.0 1.0 2.0))   ;; => (@list 1.0 2.0 3.0)
(list-sort float-compare-descending (@list 3.0 1.0 2.0))  ;; => (@list 3.0 2.0 1.0)

;; text
(list-sort text-compare-lexical (@list "c" "a" "b"))     ;; => (@list "a" "b" "c")
```
