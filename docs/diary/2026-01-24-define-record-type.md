---
title: define-record-type
author: xieyuheng
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

这种设计避免了把所有信息都一股脑地表达出来，
而是用 `<field-tag>` 作为名字，
把 field 的信息串起来。

`(<constructor> <field-tag> ...)`
相当于定义了一些名为 `<field-tag>` 的变量。
而后续的 `(<field-tag> <accessor> [<modifier>])`
定义了这些变量的属性。

具体来说，就是先声明 `x` `y`
是两个 record 内部使用的变量，
然后再在后续的语句中定义这两个变量的属性：

```scheme
  (x point-x point-set-x!)
  (y point-y point-set-y!)
```

把定义与类型声明拆分成 `define` 与 `claim`，
也是用 `<name>` 把复杂的表达式分解，并且串起来。

```scheme
(define <name> <exp>)
(claim <name> <type>)
```

prolog 和 inet 中使用名字串起来表达式，
也属于类似的设计。
