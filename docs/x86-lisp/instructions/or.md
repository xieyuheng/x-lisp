---
title: or
---

# 语法

```scheme
(or <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

按位或

# 例子

```scheme
(or (reg rax) (reg rcx))
```
