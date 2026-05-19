---
title: (define-opaque-type)
author: xieyuheng
date: 2026-05-15
---

# 问题

如何设计一种 `(define-opaque-type)` 语法，
使得下面的 `(box-t E)` 类型定义为 `(list-t E)`，
但是在类型检查的时候可以和可以和 `(list-t E)` 区分开。

```scheme
(define-type (box-t E) (list-t E))

(claim make-box
  (polymorphic (E)
    (-> (box-t E))))

(define (make-box)
  (make-list))

(claim box-empty?
  (polymorphic (E)
    (-> (box-t E) bool-t)))

(define (box-empty? box)
  (list-empty? box))

(claim box-put!
  (polymorphic (E)
    (-> E (box-t E) (box-t E))))

(define (box-put! value box)
  (if (box-empty? box)
    (list-push! value box)
    (list-put! 0 value box)))

(claim box-get-maybe
  (polymorphic (E)
    (-> (box-t E) (maybe-t E))))

(define (box-get-maybe box)
  (if (box-empty? box)
    (nothing)
    (just (car box))))

```

# 设计

可以设计为 `(define-opaque-type)` 类似 `(define-type)`，
但是同时声明一系列接口函数，声明接口函数的时候，可以省略 `(polymorphic)`。
因为类型参数可以都视为 `(polymorphic)` 的类型参数。

在对接口函数做类型检查时，`(box-t E)` 完全等价于 `(list-t E)`。

```scheme
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-empty? (-> (box-t E) bool-t))
  (box-put! (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))

(define (make-box)
  (make-list))

(define (box-empty? box)
  (list-empty? box))

(define (box-put! value box)
  (if (box-empty? box)
    (list-push! value box)
    (list-put! 0 value box)))

(define (box-get-maybe box)
  (if (box-empty? box)
    (nothing)
    (just (car box))))
```

在对其他函数做类型检查时，`(box-t E)` 不等价于 `(list-t E)`。

```scheme
(claim box-get
  (polymorphic (E)
    (-> (box-t E) E)))

(define (box-get box)
  (match (box-get-maybe box)
    ((just value) value)
    ((nothing) (error "box is empty"))))

(claim box-get-with-location
  (polymorphic (E)
    (-> (box-t E) source-location-t E)))

(define (box-get-with-location box location)
  (match (box-get-maybe box)
    ((just value) value)
    ((nothing)
     (file-write
      (current-stderr-file)
      (format-message-with-source-location "box is empty" location))
     (error "box is empty"))))
```
