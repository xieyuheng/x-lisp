---
title: test
---

# 语法

```scheme
(test <lhs> <rhs>)
```

# 操作数

```
<lhs> := (reg) (deref)
<rhs> := (reg) <int> (deref) (address)
```

<lhs> 与 <rhs> 不能同时为内存操作数

# 描述

按位与测试，设置标志位。不修改 <lhs>

# 例子

```scheme
(test (reg rax) (reg rax))
```
