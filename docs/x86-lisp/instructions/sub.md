---
title: sub
---

# 语法

```scheme
(sub <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

减法

# 例子

```scheme
(sub (reg rax) 1)
```
