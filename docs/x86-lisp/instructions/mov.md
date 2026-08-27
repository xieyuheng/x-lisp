---
title: mov
---

# 语法

```scheme
(mov <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

数据传送

# 例子

```scheme
(mov (reg rax) 42)
(mov (reg rcx) (reg rax))
```
