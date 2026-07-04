---
title: keyword-length
---

# 类型

```meta-lisp
(-> keyword-t int-t)
```

# 描述

返回关键字名的长度（不含 `:` 前缀）。

# 例子

```meta-lisp
(keyword-length :key)      ;; => 3
(keyword-length :name)     ;; => 4
```
