---
title: string-is-float
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否为合法的浮点数格式。

# 例子

```meta-lisp
(string-is-float "3.14")   ;; => true
(string-is-float "42")     ;; => true
(string-is-float "abc")    ;; => false
```
