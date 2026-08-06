---
title: text-is-int
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断字符串是否为合法的整数格式。

# 例子

```meta-lisp
(text-is-int "42")    ;; => true
(text-is-int "-1")    ;; => true
(text-is-int "3.14")  ;; => false
(text-is-int "abc")   ;; => false
```
