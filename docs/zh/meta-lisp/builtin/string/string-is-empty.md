---
title: string-is-empty
---

# 类型

```meta-lisp
(-> string-t bool-t)
```

# 描述

判断字符串是否为空（长度为 0）。

# 例子

```meta-lisp
(string-is-empty "")       ;; => true
(string-is-empty "hello")  ;; => false
```
