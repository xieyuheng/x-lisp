---
title: box-t
---

# 类型

```scheme
type-t
```

# 描述

Box 类型构造器。内部表示为 `(list-t E)`。

# 定义

```scheme
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-empty? (-> (box-t E) bool-t))
  (box-put! (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))
```

# 自动生成

```scheme
(claim make-box (polymorphic (E) (-> (box-t E))))
(claim box-empty? (polymorphic (E) (-> (box-t E) bool-t)))
(claim box-put! (polymorphic (E) (-> E (box-t E) (box-t E))))
(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
(claim box-get (polymorphic (E) (-> (box-t E) E)))
```

# 例子

```scheme
(define box (make-box))
(box-empty? box)    ;; => true
(box-put! 42 box)
(box-empty? box)    ;; => false
(box-get-maybe box) ;; => (just 42)
(box-get box)       ;; => 42
```
