---
title: assert-with-location
---

# 类型

```scheme
(-> bool-t source-location-t void-t)
```

# 描述

带源码位置的断言。如果条件为假，则报错并显示指定位置。

# 例子

```scheme
(assert-with-location (= 1 1) (make-source-location "test" ...))
```
