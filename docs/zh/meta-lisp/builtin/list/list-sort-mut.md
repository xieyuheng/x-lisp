---
title: list-sort!
---

# 类型

```scheme
(polymorphic (E) (-> (-> E E int-t) (list-t E) (list-t E)))
```

# 描述

使用比较函数对列表原地排序。返回原列表。

# 例子

```scheme
;; int
(list-sort! int-compare-ascending [3 1 2])   ;; => [1 2 3]
(list-sort! int-compare-descending [3 1 2])  ;; => [3 2 1]

;; float
(list-sort! float-compare-ascending [3.0 1.0 2.0])   ;; => [1.0 2.0 3.0]
(list-sort! float-compare-descending [3.0 1.0 2.0])  ;; => [3.0 2.0 1.0]

;; string
(list-sort! string-compare-lexical ["c" "a" "b"])     ;; => ["a" "b" "c"]
```
