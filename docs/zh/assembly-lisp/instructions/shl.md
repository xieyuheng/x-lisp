---
title: shl
---

# 语法

```scheme
(shl <dst> <src>)
```

# 操作数

```
<dst> := (reg) (reg-deref)
<src> := (reg) (imm) (reg-deref) (deref) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

左移位

# 例子

```scheme
(shl (reg rax) (imm 1))
```
