---
title: assert-not-with-location
---

# 类型

```scheme
(-> bool-t source-location-t void-t)
```

# 描述

带源码位置的否定断言。如果条件为真，则报错并显示指定位置。

# 例子

```scheme
(assert-not-with-location (= 1 2) (make-source-location "test" ...))
```
