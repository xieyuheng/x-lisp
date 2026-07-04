---
title: list-fold-left-index
---

# 类型

```meta-lisp
(polymorphic (E R) (-> (-> int-t R E R) R (list-t E) R))
```

# 描述

带索引的左折叠。回调依次接收 index、已折叠值和当前元素。

# 例子

```meta-lisp
(list-fold-left-index (lambda (i folded x) (iadd folded (imul i x))) 0 [10 20 30])
;; => 80

(list-fold-left-index (lambda (i folded _) (cons i folded)) [] ['a 'b 'c])
;; => [2 1 0]
```
