---
title: padd
---

# 类型

```scheme
(-> pointer-t int64-t pointer-t)
```

# 描述

指针字节偏移加法。`base`（`pointer-t`）加 `offset`（`int64-t`），结果为 `base + offset`。

# 例子

```scheme
(= new-ptr (padd base offset))
```
