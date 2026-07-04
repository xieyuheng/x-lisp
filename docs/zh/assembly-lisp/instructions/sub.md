---
title: sub
---

# 语法

```scheme
(sub <dst> <src>)
```

# 操作数

```
<dst> := (reg) (reg-deref)
<src> := (reg) (imm) (reg-deref) (deref) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

减法

# 例子

```scheme
(sub (reg rax) (imm 1))
```
