---
title: shr
---

# 语法

```scheme
(shr <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg rcx) <int>
```

移位计数只能是 `CL`（`(reg rcx)`）或 0..255 的立即数。

# 描述

右移位

# 例子

```scheme
(shr (reg rax) 1)
```
