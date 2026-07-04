---
title: argument
---

# 类型

```scheme
(-> T :index <int>)
```

# 描述

获取函数的第 `index` 个参数（从 0 开始）。`T` 由函数的类型声明确定。只能在 entry block 中使用。

# 例子

```scheme
(= a value-t (argument :index 0))
```
