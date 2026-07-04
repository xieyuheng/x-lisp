---
title: keyword-to-string
---

# 类型

```scheme
(-> keyword-t string-t)
```

# 描述

将关键字转换为字符串（包含 `:` 前缀）。

# 例子

```scheme
(keyword-to-string :key)   ;; => ":key"
(keyword-to-string :name)  ;; => ":name"
```
