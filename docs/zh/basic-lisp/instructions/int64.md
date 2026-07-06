---
title: int64
---

# 类型

```scheme
(-> int64-t :value <int>)
```

# 描述

零 operand 指令。通过 `:value` 属性创建 `int64-t` 类型的常量 SSA 绑定。

`:value` 接受整数值。

# 例子

```scheme
(= zero (int64 :value 0))
(= answer (int64 :value 42))
```
