---
title: define-record-type
date: 2026-01-24
---

`define-record-type` 是 scheme 语法设计的典范。

例如：

```scheme
(define-record-type point
  (make-point x y)
  point?
  (x point-x point-set-x!)
  (y point-y point-set-y!))
```

其语法设计为：

```scheme
(define-record-type <record-name>
  (<constructor> <field-tag> ...)
  <predicate>
  (<field-tag> <accessor> [<modifier>])
  ...)
```

这种设计避免了把所有信息都以此表达出来，
而是用 `<field-tag>` 作为名字，
把 field 的信息串起来。

`(<constructor> <field-tag> ...)`
相当于定义了一些名为 `<field-tag>` 的变量。
而后续的 `(<field-tag> <accessor> [<modifier>])`
定义了这些变量的属性。

# 类似的设计

`define` 与 `claim` 也是用 `<name>`
把复杂的表达式分解，并且串起来。

```scheme
(define <name> <exp>)
(claim <name> <type>)
```

prolog 和 inet 中使用名字串起来表达式，
也属于类似的设计。
