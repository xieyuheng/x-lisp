---
title: string-float?
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否为合法的浮点数格式。

# 例子

```meta-lisp
(string-float? "3.14")   ;; => true
(string-float? "42")     ;; => true
(string-float? "abc")    ;; => false
```
