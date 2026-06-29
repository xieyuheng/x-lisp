---
title: any is nominal subtype
author: xieyuheng
date: 2026-05-10
---

想要增加 `any-t`，但是发现它是 nominal type，需要约束求解。

```scheme
(claim print (-> any-t void-t))
(claim x T)
(print x)
```

类型推导 `(print x)` 时，不能直接 unify `T = any-t`，
而是要增加约束来记录 `T <: any-t`，
也就是说「实际参数必须是形式参数的子类型」。

```scheme
(claim parse (-> string-t any-t))
(claim id (polymorphic (T) (-> T T)))
(= x (parse "..."))
(= y (id x))
(iadd y y)
```

类型推导 `(id x)` 时，要记录约束 `any-t <: T`。
由于 `T <: any-t` 对任意 `T` 成立，所以此时有 `T = any-t`。
但是这是约束求解的结果，而不是 unify 结果。

对于 record type 的 structural subtype 和 row-polymorphism。
也是在用「实际参数必须是形式参数的子类型」生成约束，
只不过约束可以直接记录在 row-polymorphic type 中。

```scheme
(define-interface point-t :x float-t :y float-t)
(claim print-point (-> point-t void-t))
(claim x T)
(print-point x)
```

类型推导 `(print-point x)` 时，得到 `T <: point-t`，
可以通过 `T = (extend-interface R :x float-t :y float-t)` 来表达。
这已经不是简单的 unify 了，在目前的类型检查器实现中是没有处理的。

```scheme
(claim parse-point (-> string-t point-t))
(claim id (polymorphic (T) (-> T T)))
(= x (parse-point "..."))
(= y (id x))
```

在类型推导 `(id x)` 时，得到 `point-t <: T`。
这是没法用 row-polymorphic type 记录的？

# 结论

方案 A：

- 完全放弃 subtype。
- 放弃 interface，用 struct。
  这样可以避免用 hash 实现 interface 的效率问题。

方案 B：

- 用约束求解的方式来实现 subtype。
  可以参考：1994-qualified-types-theory-and-practice--mark-p-jones.pdf
