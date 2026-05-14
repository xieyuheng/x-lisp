---
title: string-trim
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

删除字符串两端的所有空白字符。

# 例子

```scheme
(string-trim "  hello  ")  ;; => "hello"
(string-trim "hello")      ;; => "hello"
(string-trim "  ")         ;; => ""
```
