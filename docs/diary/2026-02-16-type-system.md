---
title: type system
date: 2026-02-16
---

以 `Value` 为 `Type`。
回到我所熟悉的 bidirectional type checker。

由于 simple type 不需要 elaboration，
所以可以简单地写：

```typescript
check(ctx: Ctx, exp: Exp, type: Value): void
infer(ctx: Ctx, exp: Exp): Value
```

# union

如果想让 `define-datatype` 所引入的 union 之间，也可以形成子类型关系。
就需要能定制 data 的 hashtag。

```scheme
(define-datatype exp-t
  (var-exp (name symbol-t))
  (int-exp (value int-t))
  (bool-exp (value bool-t))
  void-exp
  (if-exp (condition exp-t) (then exp-t) (else exp-t))
  (prim-exp (op symbol-t) (args (list-t exp-t)))
  (let-exp (name symbol-t) (rhs exp-t) (body exp-t))
  (begin-exp (sequence (list-t exp-t)))
  (the-exp (type type-t) (exp exp-t)))
```

改为：

```scheme
(define-datatype exp-t
  (var-exp [#var (name symbol-t)])
  (int-exp [#int (value int-t)])
  (bool-exp [#bool (value bool-t)])
  (void-exp #void)
  (if-exp [#if (condition exp-t) (then exp-t) (else exp-t)])
  (prim-exp [#prim (op symbol-t) (args (list-t exp-t))])
  (let-exp [#let (name symbol-t) (rhs exp-t) (body exp-t)])
  (begin-exp [#begin (sequence (list-t exp-t))])
  (the-exp [#the (type type-t) (exp exp-t)]))
```

或：

```scheme
(define-datatype exp-t
  (var-exp #var (name symbol-t))
  (int-exp #int (value int-t))
  (bool-exp #bool (value bool-t))
  (void-exp #void)
  (if-exp #if (condition exp-t) (then exp-t) (else exp-t))
  (prim-exp #prim (op symbol-t) (args (list-t exp-t)))
  (let-exp #let (name symbol-t) (rhs exp-t) (body exp-t))
  (begin-exp #begin (sequence (list-t exp-t)))
  (the-exp #the (type type-t) (exp exp-t)))
```

# subtype 与 polymorphic 之间的关系

[2026-02-25]

- `typeSubtype` 不需要处理 type variable 和 unificaton 相关的问题，
  因为只要在调用 `typeSubtype` 之前先做 unificaton，
  然后处理 `substApplyToType` 之后的两个 type，
  `typeSubtype` 中原本会遇到 type variable 的地方就都已经被处理完了。

  unificaton 和 `typeSubtype` 在一个函数中做，
  这件事可以作为后续的潜在优化方案。

- 在 `typeCheck` 中，需要判断具体类型类型的时候，
  如果遇到了 type variable（经过 `substApplyToType` 之后还是 type variable），
  可以生成新的 type variable 来构造所需要判断的类型。
  比如 `A = (list-t B)`。
