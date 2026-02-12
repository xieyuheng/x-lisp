---
title: compiling claim
date: 2026-02-11
---

# 编译 (claim)

```scheme
(claim int-sum
  (-> (list? int?)
      int?))

(define (int-sum xs)
  (if (list-empty? xs)
    0
    (iadd (car xs) (int-sum (cdr xs)))))

;; =>

(define (int-sum xs)
  (= (the (list? int?) xs))
  (the int?
    (if (list-empty? xs)
      0
      (iadd (car xs) (int-sum (cdr xs))))))
```

带有 `polymorphic` 的函数：

```scheme
(claim list-append
  (polymorphic (A)
    (-> (list? A) (list? A)
        (list? A))))

(define (list-append list tail)
  (if (list-empty? list)
    (list-copy tail)
    (cons (car list) (list-append (cdr list) tail))))

;; =>

(define (list-append A list tail)
  (= (the (list? A) list))
  (= (the (list? A) tail))
  (the (list? A)
    (if (list-empty? list)
      (list-copy tail)
      (cons (car list) (list-append (cdr list) tail)))))
```

问题是多出来的这个运行时的类型参数 `A` 怎么办？

方案 A：

- 增加一个 elaboration 过程。
  为其中所有直接调用 polymorphic 函数的位置，
  都补充 `any?` 类型参数。

- 遇到 `specific` 时，使用给定的类型参数，而不是都用 `any?`。

- 当 polymorphic 函数在参数位置或 assign 的 rhs 出现时，
  elaborate 为 `(specific <name> any? ...)`。

这等价于，将所有 `<name>` 之出现，
都改为 `(specific <name> any? ...)`。
这与 `RevealGlobalPass` 类似而。

然后再之后的 pass 中，
把 `(specific <name> any? ...)`
改成 `(<name> any? ...)`。

# 简化 (polymorphic) 语法

也许可以在 `(claim)` 中，
用下面的语法来避免使用 `polymorphic` 关键词：

```scheme
(claim (list-append A)
  (-> (list? A) (list? A)
      (list? A)))

;; =>

(claim list-append
  (polymorphic (A)
    (-> (list? A) (list? A)
        (list? A))))
```
