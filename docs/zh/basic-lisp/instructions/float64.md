---
title: float64
---

# 类型

```scheme
(-> float64-t :value <float>)
```

# 描述

零 operand 指令。通过 `:value` 属性创建 `float64-t` 类型的常量 SSA 绑定。

`:value` 接受浮点数值。

# 例子

```scheme
(= pi (float64 :value 3.14))
(= half (float64 :value 0.5))
```
