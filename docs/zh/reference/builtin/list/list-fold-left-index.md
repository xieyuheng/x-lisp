---
title: list-fold-left-index
---

# 类型

```scheme
(polymorphic (E R) (-> (-> int-t R E R) R (list-t E) R))
```

# 描述

带索引的左折叠。回调依次接收 index、累加器和当前元素。

# 例子

```scheme
(list-fold-left-index (lambda (i acc x) (iadd acc (imul i x))) 0 [10 20 30])
;; => 80

(list-fold-left-index (lambda (i acc _) (cons i acc)) [] ['a 'b 'c])
;; => [2 1 0]
```
