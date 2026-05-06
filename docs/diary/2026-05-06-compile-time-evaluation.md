---
title: compile time evaluation
date: 2026-05-06
---

目前的实现中，type 是嵌入在 value 中的，
而不是另外的 algebraic data type。

效果：

- 这样可以在编译时利用解释器来计算类型。

- 这样就需要在编译器中实现解释器。
  这个解释器是不完整的，没法运行所有 builtin 函数。

- self-compile 之后就可以是完整的，
  在编译时可以运行所有 builtin 函数。
  但是这要求 value-t 就是语言的 value 的集合本身。
  也就是需要增加 any type（或者 value type）。

  这可能是最合理的设计，
  想要为新语言写解释器的时候，
  就直接把 value 嵌入在 meta-lisp 中。

  这样的代价是放弃了 value 的类型安全，
  和 value-t 的 pattern match。

  需要很多把 value 转化为具体类型的函数。
  或者模仿 typescrpit，让谓词可以在局部限制 value 的类型。

  但是也许不对，这种嵌入也许对于 type 可以用，但是对于 value 没法用。
  比如，没法区分 list 与用 list 编码的 value（比如 closure）。

  - 除非我们设计一种机制，
    专门用来区分新设计的语言，
    中语义不同的 value 在 meta 语言中的不同编码。

    - 类似 typescrpit 的 ADT 中的 kind 属性。
      或者说类似 `(define-record-type)` 所引人的新 value。
