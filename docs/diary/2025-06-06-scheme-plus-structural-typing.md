---
title: scheme plus structural typing
date: 2025-06-06
---

# Motive

在学习 jeremy siek 的编译器课程时，
又复习了一下 abdulaziz ghuloum 的编译器课程。
后者的特点是不用 ADT，直接处理 sexp。
这让人想到可以给 scheme 的 list 加 structural typing，
就像 typescript 对 javascript 所做的那样。

# Design

用 `tau` 来声明形如 list 的 structural type。

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau 'let (list-t (typle-t symbol-t exp-t)) . (list-t exp-t)))
(define fn-t (tau 'lambda (list-t symbol-t) . (list-t exp-t)))
(define ap-t (list-t exp-t))
(define program-t (tau 'program info-t . (list-t exp-t)))
```

```scheme
(claim list-t (-> type-t type-t))
(define (list-t A) (union null-t (cons-t A (list-t A))))
```
