---
title: add
---

# 语法

```scheme
(add <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

加法

# 例子

```scheme
(add (reg rax) (reg rcx))
(add (reg rax) 1)
```
