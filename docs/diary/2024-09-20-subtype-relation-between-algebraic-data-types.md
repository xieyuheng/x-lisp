---
title: Subtype relation between algebraic data types
date: 2024-09-20
---

ADT 之间也可以有子类型关系，只不过和 class 的子类型关系是对偶的。
也就是说，和 `define-class` extend 已有的 class 一样，
`define-datatype` 也可以 extend 已有的 datatype。
注意，还是 nominal 的，而不是 structural 的。

需要从 cicada-solo 中迁移一些 `define-datatype` 的例子。

这种子类型关系与 tagless finial 有关。

但是也许我们不应该实现这种子类型关系，
因为返回值的范围不能被缩小到子类型。

---

[2025-06-01] 除非用类似 class 的 override 和 open recursion。
在 class 的 open recursion 中，不是 recursion by name，
而是 recursion by marks like `self` and `super`。

这次先实现简单的 nominal ADT：

```scheme
(define-datatype (list-t A)
  [list-null () (list-t A)]
  [list-cons ([head A] [tail (list-t A)]) (list-t A)])
```

以后再考虑类似 typescript 的 ADT：

```scheme
(define (list-t A) (union (list-null-t A) (list-cons-t A)))
(define (list-null-t A) (record-type :kind 'list-null))
(define (list-cons-t A) (record-type :kind 'list-cons :head A :tail (list-t A)))
```

也许可以专门给这种使用 `record-type` + `:kind` 的方式，
设计一个简化的语法（模仿 `#f` 和 `#t`）：

```scheme
(define (list-null-t A) (#list-null))
(define (list-cons-t A) (#list-cons :head A :tail (list-t A)))
```
