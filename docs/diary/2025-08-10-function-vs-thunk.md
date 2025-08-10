---
title: function vs thunk
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
而是把这种情况处理为特殊的 Value -- `thunk`，
并且要求 `thunk` 必须以明显的方式通过 `(<thunk>)` 来作用，
没有 currying。
