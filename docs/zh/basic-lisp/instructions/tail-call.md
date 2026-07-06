---
title: tail-call
---

# 类型

```scheme
(-> pointer-t T ... R)
```

# 描述

尾调用。语义与 `call` 相同，但当前栈帧被回收。`tail-call` 是 terminator 指令。

# 例子

```scheme
(tail-call (address aux) x y)
```
