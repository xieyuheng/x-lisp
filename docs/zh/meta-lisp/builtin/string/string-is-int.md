---
title: string-is-int
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否为合法的整数格式。

# 例子

```meta-lisp
(string-is-int "42")    ;; => true
(string-is-int "-1")    ;; => true
(string-is-int "3.14")  ;; => false
(string-is-int "abc")   ;; => false
```
