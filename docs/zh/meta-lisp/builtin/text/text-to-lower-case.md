---
title: text-to-lower-case
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

将字符串中的所有字母转为小写。

# 例子

```meta-lisp
(text-to-lower-case "HELLO")  ;; => "hello"
(text-to-lower-case "Hello")  ;; => "hello"
(text-to-lower-case "123")    ;; => "123"
```
