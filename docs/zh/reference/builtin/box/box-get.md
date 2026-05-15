---
title: box-get
---

# 类型

```scheme
(polymorphic (E) (-> (box-t E) E))
```

# 描述

取出 box 中的值。空 box 时抛出错误。

# 例子

```scheme
(define box (make-box))
(box-put! 42 box)
(box-get box) ;; => 42
```
