---
title: float-greater
---

# 类型

```meta-lisp
(-> float-t float-t bool-t)
```

# 描述

判断第一个浮点数是否大于第二个。

# 例子

```meta-lisp
(float-greater 2.0 1.0)    ;; => true
(float-greater 1.0 2.0)    ;; => false
(float-greater 1.0 1.0)    ;; => false
```
