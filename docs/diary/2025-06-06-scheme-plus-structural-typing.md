---
title: scheme plus structural typing
date: 2025-06-06
---

# Motive

在学习 jeremy siek 的编译器课程时，
又复习了一下 abdulaziz ghuloum 的编译器课程。
后者的特点是不用 ADT，直接处理 sexp。
这让人想到可以给 scheme 的 list 加 structural typing，
就像 typescript 对 javascript 所做的那样。

# Design

用 `tau` 来声明形如 list 的 structural type。

```scheme
(define exp-t (union var-t int-t prim-t fn-t ap-t let-t))
(define var-t symbol-t)
(define let-t (tau 'let (list-t (typle-t symbol-t exp-t)) . (list-t exp-t)))
(define fn-t (tau 'lambda (list-t symbol-t) . (list-t exp-t)))
(define ap-t (list-t exp-t))
(define program-t (tau 'program info-t . (list-t exp-t)))
```

```scheme
(claim list-t (-> type-t type-t))
(define (list-t A) (union null-t (cons-t A (list-t A))))
```

# More Examples

可以尝试用这种类型系统去给 abdulaziz ghuloum 的课程代码加类型，
正如给 javascript 项目加 typescript 类型。

# List with Attributes

可以扩展 lisp 的 list 语义，
是的 list 可以像 XML 一样可以带 attributes。
注意，list 的 head 是 XML 的 tag 的作用，
但 tag 只能是 string，而 list 的 head 可以是 list。

假设还用 `list` 来构造 list：

```scheme
(list 'lambda (list 'x) 'x :span (list :low 0 :high 10))
```

我也在考虑避免让 built-in 函数占用 list 这种常见的名字。
也许可以模仿 `'(...)` 展开成 `(quote (...))`，
让 `[...]` 展开成 `(#list ...)`。

```scheme
['lambda ['x] 'x :span [:low 0 :high 10]]
```

这是从 shen-lang 学的，比如：

```scheme
'(a b c) => ['a 'b 'c] => (#list 'a 'b 'c)
```

注意，如果这样使用 `[...]`
那么在就不能在 `let` 和 `cond` 中使用 `[]` 了，
这也许是好事。
