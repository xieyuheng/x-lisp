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
(list-copy-sort int-compare-ascending [3 1 2])    ;; => [1 2 3]
(list-copy-sort int-compare-descending [3 1 2])   ;; => [3 2 1]

;; float
(list-copy-sort float-compare-ascending [3.0 1.0 2.0])   ;; => [1.0 2.0 3.0]
(list-copy-sort float-compare-descending [3.0 1.0 2.0])  ;; => [3.0 2.0 1.0]

;; text
(list-copy-sort text-compare-lexical ["c" "a" "b"])     ;; => ["a" "b" "c"]
```
