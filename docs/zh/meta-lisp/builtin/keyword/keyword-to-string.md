---
title: keyword-to-string
---

# 类型

```meta-lisp
(-> keyword-t string-t)
```

# 描述

将关键字转换为字符串（包含 `:` 前缀）。

# 例子

```meta-lisp
(keyword-to-string :key)   ;; => ":key"
(keyword-to-string :name)  ;; => ":name"
```
