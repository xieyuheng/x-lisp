---
title: define-algebraic-type
date: 2026-05-11
---

# (define-data)

之前设计了 `(define-data)` 之后：

```scheme
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))

;; nil
;; nil?
;; ll
;; li?
;; li-head
;; li-put-head!
;; li-tail
;; li-put-tail!
```

我一直想不通只带有单个 data constructor 的情况应该如何处理。

```scheme
(define-data (pair-t A B)
  (cons-pair (first A) (second B)))

;; cons-pair?
;; cons-pair-first
;; cons-pair-second
;; cons-pair-put-first!
;; cons-pair-put-second!

(define make-pair cons-pair)
(define pair? cons-pair?)
(define pair-first cons-pair-first)
(define pair-second cons-pair-second)
(define pair-put-first! cons-pair-put-first!)
(define pair-put-second! cons-pair-put-second!)
```

这显然太啰嗦了。

# (define-interface)

为此我才想到用作为 record type 的 interface 来实现 `pair-t`：

```scheme
(define-interface (pair-t A B)
  :first A
  :second B)

(define (make-pair first second)
  {:first first :second second})

(define (pair-first pair) (:first pair))
(define (pair-second pair) (:second pair))

(define (pair-put-first first pair) (update pair :first first))
(define (pair-put-second second pair) (update pair :second second))

(define (pair-put-first! first pair) (update! pair :first first))
(define (pair-put-second! second pair) (update! pair :second second))
```

其实这还是啰嗦，但是对于 record type，
可以用一般的 accessor 和 modifier 语法。

# (define-record-type)

其实 scheme 经典的 `(define-record-type)` 就是解决方案。
但是只不过 `(define-record-type)` 是对动态型语言定义的，
我没马上看到增加类型的方案。

`(define-record-type)` 的结构是：

```scheme
(define-record-type <type-name>
  (<constructor-name> <field-name> ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

比如：

```scheme
(define-record-type point-t
  (make-point x y)
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

看似复杂，其实 `<field-name>` 是不暴露给用户的，
类似 parameter，但是这里的设计使得它的作用也类似 entity id，
使得后续可以定义对应的 field 的 accessor 和 modifier。

其实增加类型的方案很简单，只要给 constructor 加上类型就好了。
和 `(define-data)` 中 data constructor 的 typed field 定义一样。

```scheme
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

比如上面的 `pair-t` 的定义问题：

```scheme
(define-record-type (pair-t A B)
  (make-pair (first A) (second B))
  pair?
  (first pair-first pair-put-first!)
  (second pair-second pair-put-second!))
```

# (define-algebraic-type)

这样看来，显然在 `(define-data)` 之外，

```scheme
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

应该有一个类似 `(define-record-type)` 的，
所生成的名字更 explicit 的语法：

```scheme
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head!)
   (tail li-tail li-put-tail!)))
```

# TODO named argument

TODO 按照你的 `:<key> <value>` 这种思路，
`(define-record-type)` 也应该用这种 `:<key> <value>` 来设计了，
但是 schemer 没有这样设计，而是用了更简单的 `(<key> <value>)`，
并且把所有的名字，包括：constructor、predicate、accessor 和 modifiler，
都设计成了 explicit 的。
