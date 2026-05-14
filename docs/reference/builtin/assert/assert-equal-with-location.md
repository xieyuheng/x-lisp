---
title: assert-equal-with-location
---

# 类型

```scheme
(polymorphic (A B) (-> A B source-location-t void-t))
```

# 描述

带源码位置的相等断言。如果两个值不相等，则报错并显示指定位置。

# 例子

```scheme
(assert-equal-with-location 1 1 (make-source-location "test" ...))
```
