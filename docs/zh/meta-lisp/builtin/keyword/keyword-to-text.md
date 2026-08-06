---
title: keyword-to-text
---

# 类型

```meta-lisp
(-> keyword-t text-t)
```

# 描述

将关键字转换为字符串（包含 `:` 前缀）。

# 例子

```meta-lisp
(keyword-to-text :key)   ;; => ":key"
(keyword-to-text :name)  ;; => ":name"
```
