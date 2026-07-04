---
title: string-to-lower-case
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

将字符串中的所有字母转为小写。

# 例子

```scheme
(string-to-lower-case "HELLO")  ;; => "hello"
(string-to-lower-case "Hello")  ;; => "hello"
(string-to-lower-case "123")    ;; => "123"
```
