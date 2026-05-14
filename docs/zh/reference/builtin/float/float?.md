---
title: float?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为浮点数。

# 例子

```scheme
(float? 3.14)    ;; => true
(float? 42)      ;; => false
(float? "foo")   ;; => false
```
