---
title: text-trim
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

删除字符串两端的所有空白字符。

# 例子

```meta-lisp
(text-trim "  hello  ")  ;; => "hello"
(text-trim "hello")      ;; => "hello"
(text-trim "  ")         ;; => ""
```
