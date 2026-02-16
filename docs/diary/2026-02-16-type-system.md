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
