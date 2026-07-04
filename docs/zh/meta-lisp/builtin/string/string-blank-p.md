---
title: string-blank?
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否只包含空白字符。

# 例子

```meta-lisp
(string-blank? "")     ;; => true
(string-blank? "   ")  ;; => true
(string-blank? " a ")  ;; => false
```
