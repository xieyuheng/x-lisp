---
title: shl
---

# 语法

```scheme
(shl <dst> <src>)
```

# 操作数

```
<dst> := (reg) (deref)
<src> := (reg) <int> (deref) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

左移位

# 例子

```scheme
(shl (reg rax) 1)
```
