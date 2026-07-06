---
title: const
---

# 类型

```scheme
(-> int64-t)  ;; 当 :value 为整数
(-> float64-t) ;; 当 :value 为浮点数
(-> bool-t)   ;; 当 :value 为布尔值
```

# 描述

零 operand 指令。通过 `:value` 属性创建字面量常量的 SSA 绑定。

`:value` 接受整数、浮点数或布尔值（`(true)` / `(false)`）。

# 例子

```scheme
(= zero (const :value 0))
(= pi (const :value 3.14))
(= yes (const :value (true)))
```
