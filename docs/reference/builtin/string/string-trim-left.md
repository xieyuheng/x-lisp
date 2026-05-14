---
title: string-trim-left
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

删除字符串左侧的空白字符。

# 例子

```scheme
(string-trim-left "  hello")  ;; => "hello"
(string-trim-left "hello  ")  ;; => "hello  "
(string-trim-left "hello")    ;; => "hello"
```
