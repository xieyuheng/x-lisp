---
title: string-contains
---

# 类型

```meta-lisp
(-> string-t string-t bool-t)
```

# 描述

判断字符串是否包含指定子串。

# 例子

```meta-lisp
(string-contains "hello" "ell")  ;; => true
(string-contains "hello" "xyz")  ;; => false
(string-contains "hello" "")     ;; => true
```
