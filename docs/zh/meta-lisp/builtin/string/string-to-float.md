---
title: string-to-float
---

# 类型

```meta-lisp
(-> string-t float-t)
```

# 描述

将字符串解析为浮点数。字符串不是合法浮点数格式时行为未定义。

# 例子

```meta-lisp
(string-to-float "3.14")  ;; => 3.14
(string-to-float "42")    ;; => 42.0
(string-to-float "-1.5")  ;; => -1.5
```
