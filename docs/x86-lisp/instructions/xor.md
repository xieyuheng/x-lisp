---
title: xor
---

# 语法

```scheme
(xor <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

按位异或

# 例子

```scheme
(xor (reg rax) (reg rax))
```
