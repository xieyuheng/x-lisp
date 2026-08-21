---
title: lea
---

# 语法

```scheme
(lea <dst> (mem <base> [<index>] [<scale>] [<disp>]))
```

# 操作数

```
<dst> := (reg)
```

第二个操作数必须为 `(mem ...)`，参见[(mem)](../syntax.md#mem)

# 描述

加载有效地址（Load Effective Address）。将 `(mem ...)` 计算的地址写入 <dst>

# 例子

```scheme
(lea (reg rax) (mem (reg rbp) -8))
(lea (reg rcx) (mem (reg rbx) (* (reg rax) 8)))
```
