---
title: text-is-blank
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断字符串是否只包含空白字符。

# 例子

```meta-lisp
(text-is-blank "")     ;; => true
(text-is-blank "   ")  ;; => true
(text-is-blank " a ")  ;; => false
```
