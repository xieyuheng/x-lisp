---
title: lea
---

# 语法

```scheme
(lea <dst> (reg-deref <base> [<index>] [<scale>] [<disp>]))
```

# 操作数

```
<dst> := (reg)
```

第二个操作数必须为 `(reg-deref ...)`，参见[(reg-deref)](../syntax.md#reg-deref)

# 描述

加载有效地址（Load Effective Address）。将 `(reg-deref ...)` 计算的地址写入 <dst>

# 例子

```scheme
(lea (reg rax) (reg-deref (reg rbp) -8))
(lea (reg rcx) (reg-deref (reg rbx) (reg rax) 8))
```
