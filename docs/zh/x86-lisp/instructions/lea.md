---
title: lea
---

# 语法

```scheme
(lea <dst> (deref <base> [<index>] [<scale>] [<disp>]))
```

# 操作数

```
<dst> := (reg)
```

第二个操作数必须为 `(deref ...)`，参见[(deref)](../syntax.md#deref)

# 描述

加载有效地址（Load Effective Address）。将 `(deref ...)` 计算的地址写入 <dst>

# 例子

```scheme
(lea (reg rax) (deref (reg rbp) -8))
(lea (reg rcx) (deref (reg rbx) (* (reg rax) 8)))
```
