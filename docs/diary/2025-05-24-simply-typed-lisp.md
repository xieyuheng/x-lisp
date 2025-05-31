---
title: simply typed lisp
date: 2025-05-24
---

# 动态类型

我之前想要实现动态类型的 lisp，
因为想要使用 generic dispatching。

语法关键词：

- `define-generic`
- `define-handler`
- `define-data`
- `match-data`

```scheme
(define-data exp?
  (exp-var [name string?])
  (exp-fn [name string?] [body exp?])
  (exp-ap [target exp?] [arg exp?]))

(match-data exp? exp
  [(exp-var name) ...]
  [(exp-fn name body) ...]
  [(exp-ap target arg) ...])
```

```scheme
(declare add (-> nat? nat? nat?))

(define (add x y) ...)
```

# 简单类型

但是其实对于第一个语言来说，可能简单类型更实用。
但是此时就没法支持 generic dispatching 了。

```scheme
(define-datatype exp-t
  (exp-var [name string-t])
  (exp-fn [name string-t] [body exp-t])
  (exp-ap [target exp-t] [arg exp-t]))

(check exp-var (-> string-t exp-t))
(check exp-fn (-> string-t exp-t exp-t))
(check exp-ap (-> exp-t exp-t exp-t))

(match exp
  [(exp-var name) ...]
  [(exp-fn name body) ...]
  [(exp-ap target arg) ...])
```

假设构造数据的时候，必须用数据构造子的作用语法，
也就是都要加上 `()`，零元的数据构造子也不例外，
比如 `(null)` 和 `(zero)`。

这样就能明确那些是 pattern matching 的语法了。

```scheme
(claim add (-> nat-t nat-t nat-t))

(define (add x y)
  (match x
    [(zero) y]
    [(add1 prev)
     (add1 (add prev y))]))
```

模仿 haskell 和 prolog 一个函数定义多次（一个 case 一次）：

```scheme
(define-case (add (zero) y) y)
(define-case (add (add1 prev) y) (add1 (add prev y)))
```

```scheme
(claim list-map
  (fresh-type (A B)
    (-> (list-t A) (-> A B) (list-t B))))

(define (list-map l f)
  (match l
    [(null) (null)]
    [(cons head tail)
     (cons (f head) (list-map tail f))]))
```

如果觉得 `fresh-type` 太长了，
也许可以用 `nu` 代表（new 的缩写）：

```scheme
(claim list-map
  (nu (A B)
    (-> (list-t A) (-> A B) (list-t B))))
```
