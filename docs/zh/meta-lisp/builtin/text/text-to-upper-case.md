---
title: text-to-upper-case
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

将字符串中的所有字母转为大写。

# 例子

```meta-lisp
(text-to-upper-case "hello")  ;; => "HELLO"
(text-to-upper-case "Hello")  ;; => "HELLO"
(text-to-upper-case "123")    ;; => "123"
```
