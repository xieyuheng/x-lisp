---
title: sar
---

# 语法

```scheme
(sar <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg rcx) | <int>
```

# 描述

算术右移（Shift Arithmetic Right）。

- `dst` 的位向右移，高位用符号位填充
- `src` 可以是立即数或 `(reg rcx)`

# 例子

```scheme
(sar (reg rax) 1)
(sar (reg rax) 3)
(sar (reg rcx) (reg rcx))
```
