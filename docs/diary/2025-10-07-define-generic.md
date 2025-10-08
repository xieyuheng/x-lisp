---
title: define-generic
date: 2025-10-07
---

# 类似 data constructor 的语法

关于 generic dispatching，
之前想的都是类似这样的语法：

```scheme
(define-generic add :arity 2)
(define-method (add (x int?) (x int?)) (iadd x y))
(define-method (add (x float?) (x float?)) (fadd x y))
```

这符合 `define-data` 中定义 data constructor 的语法。

这看起来不方便返回值类型的声明，但是其实可以用 `the`：

```scheme
(define-generic add :arity 2)
(define-method (add (x int?) (x int?)) (the int? (iadd x y)))
(define-method (add (x float?) (x float?)) (the float? (fadd x y)))
```

# 支持任何 arrow

但是上面这种设计可能没法用 polymorphic 参数。

如果想加入 polymorphic 参数，可以考虑支持任意 arrow：

```scheme
(define-generic add :arity 2)
(define-method add (-> int? int? int?) (lambda (x y) (iadd x y)))
(define-method add (-> float? float? float?) (lambda (x y) (fadd x y)))
```

这样的好处是 schema 位置和 value 位置，可以是任何 value，
因此可以写成这样：

```scheme
(define-generic add :arity 2)
(define-method add (-> int? int? int?) iadd)
(define-method add (-> float? float? float?) fadd)
```

这要求我们能够把 arrow 用作 predicate，
来检查 arguments 是否符合 arrow 的 argument schemas
以形成 dispatch。

我发现两种语法可以同时支持！

# 语法关键词的选择

`define-generic` 我想不到更好的选择。

`define-method` 来自 common-lisp 的 defmethod，这个我还见过：

- `define-handler` -- sussamn 用过
- `define-case`
