---
title: string?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为字符串。

# 例子

```scheme
(string? "hello")  ;; => true
(string? 42)       ;; => false
(string? 'foo)     ;; => false
```
