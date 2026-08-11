---
title: set
---

# 语法

```scheme
(set (cc <code>) <dst>)
```

# 操作数

```
<code> := e ne l le g ge b be a ae
<dst>  := (reg) — 8-bit 目标寄存器
```

# 描述

按条件码设置目标寄存器的低字节：

- 条件成立时 `dst` 设为 `1`
- 条件不成立时 `dst` 设为 `0`

使用与 [`j`](j.md) 相同的条件码映射。

# 例子

```scheme
(set (cc e) (reg al))
(set (cc ne) (reg cl))
(set (cc g) (reg bl))
```
