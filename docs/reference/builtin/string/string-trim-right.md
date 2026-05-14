---
title: string-trim-right
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

删除字符串右侧的空白字符。

# 例子

```scheme
(string-trim-right "hello  ")  ;; => "hello"
(string-trim-right "  hello")  ;; => "  hello"
(string-trim-right "hello")    ;; => "hello"
```
