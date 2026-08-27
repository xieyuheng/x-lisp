---
title: and
---

# 语法

```scheme
(and <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

按位与

# 例子

```scheme
(and (reg rax) (reg rcx))
```
