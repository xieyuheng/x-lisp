---
title: int64
---

# 类型

```scheme
(-> int64-t :content <int>)
```

# 描述

零 input 指令。通过 `:content` 属性创建 `int64-t` 类型的常量 SSA 绑定。

`:content` 接受整数值。

# 例子

```scheme
(= zero (int64 :content 0))
(= answer (int64 :content 42))
```
