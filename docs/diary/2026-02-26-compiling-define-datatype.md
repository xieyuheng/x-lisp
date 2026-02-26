---
title: compiling define-datatype
date: 2026-02-26
---

之前说 x-lisp 之所以可以用，就在于可以用 `define-data` 来描述 ADT。
现在重新加回来了类型系统，就真的是 ADT 了。

```scheme
(define-datatype (my-list-t E)
  nil
  (li (head E) (tail (my-list-t E))))
```

需要在编译时把它展开，并且生成所需要的函数和类型。

`my-list-t` 本身会被定义为 `DatatypeDefinition`，所以不用管。

```scheme
;; DataConstructor

(claim nil
  (polymorphic (E)
    (my-list-t E)))

(define nil #nil)

(claim li
  (polymorphic (E)
    (-> E (my-list-t E)
        (my-list-t E))))

(define (li head tail) [#li head tail])

;; DataGetter

(claim li-head
  (polymorphic (E)
    (-> (my-list-t E)
        E)))

(define (li-head target) (list-get 1 target))

(claim li-head
  (polymorphic (E)
    (-> (my-list-t E)
        (my-list-t E))))

(define (li-tail target) (list-get 2 target))

;; DataPutter

(claim li-put-head!
  (polymorphic (E)
    (-> E (my-list-t E)
        (my-list-t E))))

(define (li-put-head! value target) (list-put! 1 value target))

(claim li-put-tail!
  (polymorphic (E)
    (-> (my-list-t E) (my-list-t E)
        (my-list-t E))))

(define (li-put-tail! value target) (list-put! 2 value target))

(claim li-put-head
  (polymorphic (E)
    (-> E (my-list-t E)
        (my-list-t E))))

(define (li-put-head value target) (list-put 1 value target))

(claim li-put-tail
  (polymorphic (E)
    (-> (my-list-t E) (my-list-t E)
        (my-list-t E))))

(define (li-put-tail value target) (list-put 2 value target))
```
