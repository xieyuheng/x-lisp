---
title: string-float?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

判断字符串是否为合法的浮点数格式。

# 例子

```scheme
(string-float? "3.14")   ;; => true
(string-float? "42")     ;; => true
(string-float? "abc")    ;; => false
```
