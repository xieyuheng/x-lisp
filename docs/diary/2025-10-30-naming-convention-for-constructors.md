---
title: naming convention for constructors
date: 2025-10-30
---

在 x-lisp 中，当前 constructor 命名惯例是：`<ctor-name>-<type-name>`。

比如：

```scheme
(make-graph vertices edges)
(make-empty-graph)
```

而不是类似 scalable c 的：

```scheme
(graph-new vertices edges)
(graph-new-empty)
```

constructor name 前置更自然。

并且与 `define-data` 的 variant 命名惯例一致：

```scheme
(define-data exp?
  (var-exp (name symbol?))
  (int-exp (value int?))
  (bool-exp (value bool?))
  void-exp
  (if-exp (condition exp?) (then exp?) (else exp?))
  (prim-exp (op symbol?) (args (list? exp?)))
  (let-exp (name symbol?) (rhs exp?) (body exp?))
  (begin-exp (sequence (list? exp?)))
  (the-exp (type type?) (exp exp?)))
```

variant 就是特殊的 constructor。

`define-data` 的 variant 之所以前置 variant name，
是因为接受了 deepseek 的建议。

它说，pattern matching 的过程中，
一个 algebraic data type 的 variant 才是我们所主要关心的，
因此 variant name 应该前置。

# 推论

以此类推，在写 scalable c 的时候，
可能 `new` 也应该前置，
应该写 `new_list` 而不是 `list_new`。

或者写 `make_list` 这个动词短语，
这样可以继续用 `new_list` 来命名变量。

这样能在两种语言的代码中保持命名惯例一致。

同样，scalable c 中的 setter 也应该改成 putter。
