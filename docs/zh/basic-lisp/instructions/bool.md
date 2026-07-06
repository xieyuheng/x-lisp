---
title: bool
---

# 类型

```scheme
(-> bool-t :content <bool>)
```

# 描述

零 operand 指令。通过 `:content` 属性创建 `bool-t` 类型的常量 SSA 绑定。

`:content` 接受布尔值 `(true)` 或 `(false)`。

# 例子

```scheme
(= yes (bool :content (true)))
(= no (bool :content (false)))
```
