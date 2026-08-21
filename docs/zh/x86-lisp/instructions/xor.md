---
title: xor
---

# 语法

```scheme
(xor <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

按位异或

# 例子

```scheme
(xor (reg rax) (reg rax))
```
