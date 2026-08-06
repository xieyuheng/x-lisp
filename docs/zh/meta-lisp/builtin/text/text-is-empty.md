---
title: text-is-empty
---

# 类型

```meta-lisp
(-> text-t bool-t)
```

# 描述

判断字符串是否为空（长度为 0）。

# 例子

```meta-lisp
(text-is-empty "")       ;; => true
(text-is-empty "hello")  ;; => false
```
