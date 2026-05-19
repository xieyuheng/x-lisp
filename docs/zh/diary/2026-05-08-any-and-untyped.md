---
title: any and untyped
author: xieyuheng
date: 2026-05-08
---

为了让解释器可以以语言本身的 value 为 value，计划加入 `any-t` 类型。

加入 `any-t` 的动机：

- 可以用来探索用 `(define-generic)` 编程，
  比如 propagator model 的经典实现方式。

- 可以获得一个 untyped 版本的 meta-lisp。

- meta-circular evaluator 可以直接用 hosting 语言的 value 作为 value。
  此时 primitive function 就是 hosting 语言的正常 function。

- 可以在类型检查时调用解释器，因此可以用同一个语言来计算类型。
  注意，这不是 dependent type，type 可以依赖 type argument，
  但是不能依赖 apply 时的 argument。
