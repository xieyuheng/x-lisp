---
title: string-to-upper-case
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

将字符串中的所有字母转为大写。

# 例子

```scheme
(string-to-upper-case "hello")  ;; => "HELLO"
(string-to-upper-case "Hello")  ;; => "HELLO"
(string-to-upper-case "123")    ;; => "123"
```
