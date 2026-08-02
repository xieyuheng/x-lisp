---
title: list-copy-sort
---

# 类型

```meta-lisp
(polymorphic (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# 描述

使用比较函数排序列表的副本。不修改原列表。

# 例子

```meta-lisp
;; int
(list-copy-sort int-compare-ascending [3 1 2])    ;; => [1 2 3]
(list-copy-sort int-compare-descending [3 1 2])   ;; => [3 2 1]

;; float
(list-copy-sort float-compare-ascending [3.0 1.0 2.0])   ;; => [1.0 2.0 3.0]
(list-copy-sort float-compare-descending [3.0 1.0 2.0])  ;; => [3.0 2.0 1.0]

;; string
(list-copy-sort string-compare-lexical ["c" "a" "b"])     ;; => ["a" "b" "c"]
```
