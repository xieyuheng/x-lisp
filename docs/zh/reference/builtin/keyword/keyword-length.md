---
title: keyword-length
---

# 类型

```scheme
(-> keyword-t int-t)
```

# 描述

返回关键字名的长度（不含 `:` 前缀）。

# 例子

```scheme
(keyword-length :key)      ;; => 3
(keyword-length :name)     ;; => 4
```
