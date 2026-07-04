---
title: string-trim
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

删除字符串两端的所有空白字符。

# 例子

```meta-lisp
(string-trim "  hello  ")  ;; => "hello"
(string-trim "hello")      ;; => "hello"
(string-trim "  ")         ;; => ""
```
