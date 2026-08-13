---
title: remove define-struct*
author: xieyuheng
date: 2026-08-14
---

# 删除 (define-struct*)

`(define-struct*)` 是 `(define-struct)` 的一个变体，
在 [2026-05-11-define-algebraic-type](./2026-05-11-define-algebraic-type.md) 中提出：
用户提供 constructor-name，其余名字（谓词、访问器、修改器）仍按约定生成。

```meta-lisp
(define-struct* point-t
  (make-point
   (x float-t)
   (y float-t)))
```

它从未被任何实际代码使用过——
编译器自身、示例、CLI 等所有 .meta 源码都没有用到它。
删除前调查确认：它只存在于两套编译器实现（meta-lisp.js 与 meta-lisp.meta）、
测试和文档中。

# 为什么删除

## 直接理由

- 零实际使用者，删掉它没有任何代码需要迁移。
- 表达能力没有损失：`(define-struct*)` 能表达的，
  `(define-algebraic-type)` 都能表达。
- 自举编译器（meta-lisp.meta，WIP）少维护一个语法特性。

## 根本论证：命名约定服务于模式匹配

`(define-struct)` 的 `make-<base>` 约定实现了类型名与构造器名之间的双向可推导：

- 看到类型 `point-t`，知道构造器是 `make-point`。
- 看到模式 `((make-point x y) ...)`，知道在消费 `point-t`。

模式匹配中，构造器名是分支语义的第一信息。
如果允许自定义构造器名（`(define-struct*)`），
读到 `((create-point x y) ...)` 时必须回查类型定义，或依赖记忆。
类型定义只写一次，模式匹配却要读很多次——
生产方省下的一次命名思考，转嫁成了消费方很多次的查找负担。

这与 [2025-10-30-naming-convention-for-constructors](./2025-10-30-naming-convention-for-constructors.md) 中
"pattern matching 的过程中，一个 algebraic data type 的 variant 才是我们所主要关心的"
的思想一脉相承：命名惯例应当服务于模式匹配的可读性。

`(define-struct*)` 处于一个尴尬的中间态：
它承诺了便捷（自动生成谓词/访问器/修改器名），
却打破了最关键的构造器名约定。
语言应该提供清晰的立场——`(define-struct)` 全约定，`(define-algebraic-type)` 全显式——
而不是"半自动半自由"的模糊中间态。
这或许也解释了它为什么从未被使用：
用它定义的类型，模式匹配读起来就是别扭。

# 参考

- 删除提交：a2c92ee23
- 语法的由来：[2026-05-11-define-algebraic-type](./2026-05-11-define-algebraic-type.md)
