---
title: string-append
---

# 类型

```scheme
(-> string-t string-t string-t)
```

# 描述

拼接两个字符串。

# 例子

```scheme
(string-append "hello" " world")  ;; => "hello world"
(string-append "a" "b")           ;; => "ab"
(string-append "" "hello")        ;; => "hello"
```
