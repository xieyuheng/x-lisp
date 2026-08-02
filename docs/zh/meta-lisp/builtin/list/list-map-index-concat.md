---
title: list-map-index-concat
---

# 类型

```meta-lisp
(polymorphic (A B) (-> (-> int-t A (list-t B)) (list-t A) (list-t B)))
```

# 描述

对列表中的每个元素应用带索引的函数，将结果列表扁平化一层。

# 例子

```meta-lisp
(list-map-index-concat (lambda (i x) [i x]) [10 20 30])
;; => [0 10 1 20 2 30]

(list-map-index-concat (lambda (i x) [(make-pair i x) (make-pair i x)]) ['a 'b 'c])
;; => [(make-pair 0 'a) (make-pair 0 'a) (make-pair 1 'b) (make-pair 1 'b) (make-pair 2 'c) (make-pair 2 'c)]
```
