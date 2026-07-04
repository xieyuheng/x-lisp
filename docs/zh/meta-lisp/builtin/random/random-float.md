---
title: random-float
---

# 类型

```meta-lisp
(-> float-t float-t float-t)
```

# 描述

在 [min, max) 范围内生成随机浮点数。

# 例子

```meta-lisp
(random-float 0.0 1.0)   ;; => 0.0 到 1.0 之间的随机浮点数
(random-float -1.0 1.0)  ;; => -1.0 到 1.0 之间的随机浮点数
```
