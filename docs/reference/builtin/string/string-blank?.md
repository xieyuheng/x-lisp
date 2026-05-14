---
title: string-blank?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

判断字符串是否只包含空白字符。

# 例子

```scheme
(string-blank? "")     ;; => true
(string-blank? "   ")  ;; => true
(string-blank? " a ")  ;; => false
```
