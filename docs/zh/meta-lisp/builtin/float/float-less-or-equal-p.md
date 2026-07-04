---
title: float-less-or-equal?
---

# 类型

```meta-lisp
(-> float-t float-t bool-t)
```

# 描述

判断第一个浮点数是否小于或等于第二个。

# 例子

```meta-lisp
(float-less-or-equal? 1.0 2.0)   ;; => true
(float-less-or-equal? 1.0 1.0)   ;; => true
(float-less-or-equal? 2.0 1.0)   ;; => false
```
