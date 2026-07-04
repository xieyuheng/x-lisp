---
title: box-put!
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (box-t E) (box-t E)))
```

# 描述

向 box 中存入值。可变操作，同时返回更新后的 box。

# 例子

```meta-lisp
(define box (make-box))
(box-put! 42 box)
(box-get box) ;; => 42
```
