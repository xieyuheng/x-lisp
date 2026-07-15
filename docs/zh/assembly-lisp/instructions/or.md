---
title: or
---

# 语法

```scheme
(or <dst> <src>)
```

# 操作数

```
<dst> := (reg) (deref)
<src> := (reg) <int> (deref) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

按位或

# 例子

```scheme
(or (reg rax) (reg rcx))
```
