---
title: string-is-blank
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否只包含空白字符。

# 例子

```meta-lisp
(string-is-blank "")     ;; => true
(string-is-blank "   ")  ;; => true
(string-is-blank " a ")  ;; => false
```
