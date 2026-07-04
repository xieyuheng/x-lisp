---
title: box-get-maybe
---

# 类型

```meta-lisp
(polymorphic (E) (-> (box-t E) (maybe-t E)))
```

# 描述

取出 box 中的值。空 box 返回 `(nothing)`，有值返回 `(just value)`。

# 例子

```meta-lisp
(define box (make-box))
(box-get-maybe box) ;; => (nothing)
(box-put! 42 box)
(box-get-maybe box) ;; => (just 42)
```
