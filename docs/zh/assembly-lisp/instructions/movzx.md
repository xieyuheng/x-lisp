---
title: movzx
---

# 语法

```scheme
(movzx <dst> <src>)
```

# 操作数

```
<dst> := (reg) — 64-bit 目标寄存器
<src> := (reg) — 8-bit 源寄存器
```

# 描述

将源寄存器的低字节零扩展（zero-extend）至 64 位，写入目标寄存器。

常与 [`set`](set.md) 搭配使用，将条件判断的结果（1 字节 0/1）扩展至完整的 64 位布尔值。

# 例子

```scheme
(movzx (reg rax) (reg al))
(movzx (reg rcx) (reg bl))
```
