---
title: float-less
---

# 类型

```meta-lisp
(-> float-t float-t bool-t)
```

# 描述

判断第一个浮点数是否小于第二个。

# 例子

```meta-lisp
(float-less 1.0 2.0)     ;; => true
(float-less 2.0 1.0)     ;; => false
(float-less 1.0 1.0)     ;; => false
```
