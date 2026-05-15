---
title: box-t
---

# 类型

```scheme
(polymorphic (E) (-> type-t type-t))
```

# 描述

不透明类型 `(box-t E)` 的类型构造器。内部表示为 `(list-t E)`。

# 接口函数

## 构造器

```scheme
(claim make-box (polymorphic (E) (-> (box-t E))))
```

## 谓词

```scheme
(claim box-empty? (polymorphic (E) (-> (box-t E) bool-t)))
```

## 修改器

```scheme
(claim box-put! (polymorphic (E) (-> E (box-t E) (box-t E))))
```

## 访问器

```scheme
(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
(claim box-get      (polymorphic (E) (-> (box-t E) E)))
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
