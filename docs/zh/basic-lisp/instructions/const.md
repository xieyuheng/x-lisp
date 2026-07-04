---
title: const
---

# 类型

```scheme
(-> T T)
```

# 描述

将 operand 绑定到 SSA 名。用于为地址常量等非 SSA 值创建 SSA 引用。

# 例子

```scheme
(= p pointer-t (const (address origin)))
```
