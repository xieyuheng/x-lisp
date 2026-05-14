---
title: string-empty?
---

# 类型

```scheme
(-> string-t bool-t)
```

# 描述

判断字符串是否为空（长度为 0）。

# 例子

```scheme
(string-empty? "")       ;; => true
(string-empty? "hello")  ;; => false
```
