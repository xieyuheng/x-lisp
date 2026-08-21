---
title: shr
---

# 语法

```scheme
(shr <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

右移位

# 例子

```scheme
(shr (reg rax) 1)
```
