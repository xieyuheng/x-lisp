---
title: and
---

# 语法

```scheme
(and <dst> <src>)
```

# 操作数

```
<dst> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dst> 与 <src> 不能同时为内存操作数

# 描述

按位与

# 例子

```scheme
(and (reg rax) (reg rcx))
```
