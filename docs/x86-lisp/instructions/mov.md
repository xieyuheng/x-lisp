---
title: mov
---

# 语法

```scheme
(mov <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

数据传送

# 例子

```scheme
(mov (reg rax) 42)
(mov (reg rcx) (reg rax))
```
