---
title: Generic Function
date: 2024-09-18
---

在学习 Propagator 的时候，
已经发现 generic 非常好用了，
完全是 OOP 里各种技巧的上位替代。

```scheme
(define (responsible [entry entry-t])
  (if (is-kind-of entry film)
    entry:producer
    entry:author))


(define-handler (responsible [film film-t])
  film:producer)

(define-handler (responsible [entry entry-t])
  entry:author)
```

因为太常用了，所以也许 `define`
默认就应该用来定义 generic 的 handler，
而不用每次都写 `define-handler`。

```scheme
(define (responsible [entry entry-t])
  (if (is-kind-of entry film)
    entry:producer
    entry:author))


(define (responsible [film film-t])
  film:producer)

(define (responsible [entry entry-t])
  entry:author)
```
