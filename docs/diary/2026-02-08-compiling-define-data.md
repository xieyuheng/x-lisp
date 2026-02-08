---
title: compiling define-data
date: 2026-02-08
---

x-lisp 之所以可以用，就在于可以用 `define-data` 来描述 ADT：

```scheme
(define-data (my-list? E)
  nil
  (li (head E) (tail (my-list? E))))
```

之前在解释器中，是设置新的 value 类型，
在运行时处理这些 value 的 apply：

```typescript
export type AboutData =
  | DataPredicate
  | DataConstructor
  | DataConstructorPredicate
  | DataGetter
  | DataPutter
```

用编译器时，最简单的方案是把这些编译为函数：

```scheme
;; DataConstructor

(define nil #nil)
(define (li head tail) (#li head tail))

;; DataGetter

(define (li-head target) (list-get 1 target))
(define (li-tail target) (list-get 2 target))

;; DataPutter

(define (li-put-head! target value) (list-put! 1 value target))
(define (li-put-tail! target value) (list-put! 2 value target))

(define (li-put-head target value) (list-put 1 value target))
(define (li-put-tail target value) (list-put 2 value target))

;; DataConstructorPredicate

(define (nil? value) (equal? value #nil))
(define (li? value)
  (and (any-list? value)
       (equal? (list-length value) 3)
       (equal? (list-head value) #li)))

;; DataPredicate

;; TODO
```
