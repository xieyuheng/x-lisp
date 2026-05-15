---
title: make-box
---

# 类型

```scheme
(polymorphic (E) (-> (box-t E)))
```

# 描述

创建空 box。

# 例子

```scheme
(define box (make-box))
(box-empty? box) ;; => true
```
