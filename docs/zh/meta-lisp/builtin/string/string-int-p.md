---
title: string-int?
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否为合法的整数格式。

# 例子

```meta-lisp
(string-int? "42")    ;; => true
(string-int? "-1")    ;; => true
(string-int? "3.14")  ;; => false
(string-int? "abc")   ;; => false
```
