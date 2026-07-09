---
title: copy
---

# 类型

```scheme
(-> T T)
```

`T` 为任意类型，输入与输出类型相同。

# 描述

创建 SSA 别名。将 input 的值绑定到新的 cell，二者是同一个值。

# 例子

```scheme
(= x int64-t (copy y))
(= p pointer-t (copy (address origin)))
```
