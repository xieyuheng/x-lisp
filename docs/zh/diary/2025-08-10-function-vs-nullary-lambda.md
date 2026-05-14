---
title: function vs nullary lambda
date: 2025-08-10
---

假设允许出现参数个数为 0 的 lambda：

```scheme
(define f (lambda () iadd))
```

那么是否要给这种 lambda 实现自动 currying 呢？

```scheme
((f) 1 2)
(f 1 2)
```

我们不这样做。
由于有了自动 currying，
所以我们要求 lambda 的参数个数不能为 0，
而是把这种情况处理为有别于 `Lambda` 的 `Value`
-- `NullaryLambda`，
要求它必须以明显的方式通过 `(target)` 来作用，
并且没有 currying。
