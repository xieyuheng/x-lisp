---
title: list-fold-right-index
---

# 类型

```scheme
(polymorphic (E R) (-> (-> int-t E R R) R (list-t E) R))
```

# 描述

带索引的右折叠。回调依次接收 index、当前元素和累加器。

# 例子

```scheme
(list-fold-right-index (lambda (i x acc) (cons (make-pair i x) acc)) [] ['a 'b 'c])
;; => [(make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c)]

(list-fold-right-index (lambda (i x acc) (iadd (imul i x) acc)) 0 [10 20 30])
;; => 80
```
