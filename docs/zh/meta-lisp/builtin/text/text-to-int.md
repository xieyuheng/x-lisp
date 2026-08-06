---
title: text-to-int
---

# 类型

```meta-lisp
(-> text-t int-t)
```

# 描述

将字符串解析为整数。字符串不是合法整数格式时行为未定义。

# 例子

```meta-lisp
(text-to-int "42")    ;; => 42
(text-to-int "-1")    ;; => -1
(text-to-int "0")     ;; => 0
```
