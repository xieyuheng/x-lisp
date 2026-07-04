---
title: imul
---

# 语法

```scheme
(imul <dst> <src>)
```

# 操作数

```
<dst> := (reg) (reg-deref)
<src> := (reg) (imm) (reg-deref) (deref) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

有符号乘法

# 例子

```scheme
(imul (reg rax) (reg rcx))
```
