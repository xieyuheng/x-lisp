---
title: back to simple type
date: 2026-02-13
---

实现作为 contract 系统的 `(claim)` 时发现：

- 只有在运行时处理带有 arrow 的函数的 apply 才行。
- 对于 return value 的 contract，会影响用 tail call 来实现循环。

所以反过来重新考虑实现 simple type，
也就是直接实现之前提出的 meta-lisp。

如若如此，现在的 runtime 已经够用了，
类型检查可以完全放在编译器前端来实现。

# old TODO

[lisp] `Arrow` as `Exp` -- `evaluate` to `[#-> <arg-schemas> <ret-schema>]`

[lisp] `x_the` -- if schema is arrow, return `[#the <schema> <target>]`

- `apply` handle `[#the <schema> <target>]` as target

[lisp] `expandClaim` -- test by `my-string-repeat`
[pass] `ElaborateClaimed` -- before `ShrinkPass`

[lisp] `expandClaim` -- handle `(polymorphic)`
[lisp] `Specific` as `Exp` -- like `Apply`

# simple type system

实现 type system 的方案有很多。

方案 A：

- bidirectional type checker。
  这需要先实现一个解释器，然后以 `Value` 为 `Type`。

  ```typescript
  check(ctx: Ctx, exp: Exp, type: Value): void
  ```

方案 B：

- 不实现解释器，在 `Exp` 之外设置专门的 `Type` 类型。

  ```typescript
  check(ctx: Ctx, exp: Exp, type: Type): void
  ```

# 徘徊

之前决定实现纯动态类型语言，
很大原因是为了 generic function。

在 lattice-lisp 的 repo 中，有很多相关的笔记。

改为静态类型之后如何处理 generic function？

也许 generic function 适合没有 `(claim)` 机制的动态类型语言，
因为现在（动态类型版本的 x-lisp）的问题，
都在于 `(claim)` 语法所带来的 runtime overhead。

是否可以说，`(the)` 已经是足够用的 schema 语法了，
不必再实现 `(claim)` 了？

也不对，没有 `(claim)` 来表明函数意图的语言，
实在是没法用。

先暂时放弃 generic function 这个功能，
先实现一个可以用的 simple type 语言。

# 递归类型

之前实现 structural type 的递归类型检查器时，
遇到的问题 union 和 inter 两个算子的 normalization。

如果用 `define-datatype`，就没有 union 了。
