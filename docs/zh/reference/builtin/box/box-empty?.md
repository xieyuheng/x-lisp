---
title: box-empty?
---

# 类型

```scheme
(polymorphic (E) (-> (box-t E) bool-t))
```

# 描述

判断 box 是否为空。

# 例子

```scheme
(define box (make-box))
(box-empty? box) ;; => true
(box-put! 42 box)
(box-empty? box) ;; => false
```
