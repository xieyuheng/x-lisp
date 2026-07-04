---
title: cmp
---

# 语法

```scheme
(cmp <lhs> <rhs>)
```

# 操作数

```
<lhs> := (reg) (reg-deref)
<rhs> := (reg) (imm) (reg-deref) (deref) (address)
```

<lhs> 与 <rhs> 不能同时为内存操作数

# 描述

比较，设置标志位。不修改 <lhs>

# 例子

```scheme
(cmp (reg rax) (reg rcx))
```
