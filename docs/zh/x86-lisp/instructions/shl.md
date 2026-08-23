---
title: shl
---

# 语法

```scheme
(shl <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg rcx) <int>
```

移位计数只能是 `CL`（`(reg rcx)`）或 0..255 的立即数。

# 描述

左移位

# 例子

```scheme
(shl (reg rax) 1)
```
