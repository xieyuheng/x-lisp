---
title: bool
---

# 类型

```scheme
(-> bool-t :value <bool>)
```

# 描述

零 operand 指令。通过 `:value` 属性创建 `bool-t` 类型的常量 SSA 绑定。

`:value` 接受布尔值 `(true)` 或 `(false)`。

# 例子

```scheme
(= yes (bool :value (true)))
(= no (bool :value (false)))
```
