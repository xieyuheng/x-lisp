---
title: text-is-float
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断字符串是否为合法的浮点数格式。

# 例子

```meta-lisp
(text-is-float "3.14")   ;; => true
(text-is-float "42")     ;; => true
(text-is-float "abc")    ;; => false
```
