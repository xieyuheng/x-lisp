---
title: string?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为字符串。

# 例子

```meta-lisp
(string? "hello")  ;; => true
(string? 42)       ;; => false
(string? 'foo)     ;; => false
```
