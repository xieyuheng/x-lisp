---
title: imul
---

# 语法

```scheme
(imul <dest> <src>)
```

# 操作数

```
<dest> := (reg) (mem)
<src> := (reg) <int> (mem) (address)
```

<dest> 与 <src> 不能同时为内存操作数

# 描述

有符号乘法

# 例子

```scheme
(imul (reg rax) (reg rcx))
```
