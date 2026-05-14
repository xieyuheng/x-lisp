---
title: string-trim-start
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

删除字符串开头的空白字符，同 `string-trim-left`。

# 例子

```scheme
(string-trim-start "  hello")  ;; => "hello"
(string-trim-start "hello  ")  ;; => "hello  "
```
