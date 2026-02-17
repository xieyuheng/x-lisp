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
