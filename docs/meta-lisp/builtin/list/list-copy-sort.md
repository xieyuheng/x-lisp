---
title: list-copy-sort
---

# Type

```meta-lisp
(all (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# Description

Sort a copy of the list using a comparator function. The original list is not modified.

# Examples

```meta-lisp
;; int
(list-copy-sort int-compare-ascending (@list 3 1 2))    ;; => (@list 1 2 3)
(list-copy-sort int-compare-descending (@list 3 1 2))   ;; => (@list 3 2 1)

;; float
(list-copy-sort float-compare-ascending (@list 3.0 1.0 2.0))   ;; => (@list 1.0 2.0 3.0)
(list-copy-sort float-compare-descending (@list 3.0 1.0 2.0))  ;; => (@list 3.0 2.0 1.0)

;; text
(list-copy-sort text-compare-lexical (@list "c" "a" "b"))     ;; => (@list "a" "b" "c")
```
