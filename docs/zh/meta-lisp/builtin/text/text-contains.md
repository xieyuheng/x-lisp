---
title: text-contains
---

# 类型

```meta-lisp
(-> text-t text-t bool-t)
```

# 描述

判断字符串是否包含指定子串。

# 例子

```meta-lisp
(text-contains "hello" "ell")  ;; => true
(text-contains "hello" "xyz")  ;; => false
(text-contains "hello" "")     ;; => true
```
