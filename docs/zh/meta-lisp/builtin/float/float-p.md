---
title: float?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为浮点数。

# 例子

```meta-lisp
(float? 3.14)    ;; => true
(float? 42)      ;; => false
(float? "foo")   ;; => false
```
