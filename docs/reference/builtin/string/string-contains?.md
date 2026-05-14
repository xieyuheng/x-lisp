---
title: string-contains?
---

# 类型

```scheme
(-> string-t string-t bool-t)
```

# 描述

判断字符串是否包含指定子串。

# 例子

```scheme
(string-contains? "hello" "ell")  ;; => true
(string-contains? "hello" "xyz")  ;; => false
(string-contains? "hello" "")     ;; => true
```
