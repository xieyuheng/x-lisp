---
title: format
---

# 类型

```scheme
(polymorphic (A) (-> A string-t))
```

# 描述

将任意值格式化为字符串表示。

# 例子

```scheme
(format 42)       ;; => "42"
(format "hello")  ;; => "\"hello\""
(format [1 2 3])  ;; => "[1 2 3]"
```
