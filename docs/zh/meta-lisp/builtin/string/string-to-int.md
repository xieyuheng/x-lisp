---
title: string-to-int
---

# 类型

```scheme
(-> string-t int-t)
```

# 描述

将字符串解析为整数。字符串不是合法整数格式时行为未定义。

# 例子

```scheme
(string-to-int "42")    ;; => 42
(string-to-int "-1")    ;; => -1
(string-to-int "0")     ;; => 0
```
