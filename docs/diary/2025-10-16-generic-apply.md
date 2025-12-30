---
title: generic apply
date: 2025-10-16
---

假设实现了 generic 的 apply，
那么就可以对原本不可以被 apply 的 `tau` 类数据，
定义 apply 方法：

```scheme
(define-generic apply (-> any? (list? any?) any?))
(define-method (apply (target (tau ...)) (args (list? any?))))
```

这样就可以在不脱离 sexp 基础数据类型的同时，扩展 apply 的语义。

而扩展 apply 的语义，
正是设计 applicative 语言的核心。
