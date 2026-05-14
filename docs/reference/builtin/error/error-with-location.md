---
title: error-with-location
---

# 类型

```scheme
(polymorphic (A B) (-> A source-location-t B))
```

# 描述

带源码位置的错误。抛出错误并关联到指定源码位置。

# 例子

```scheme
(error-with-location "unexpected value" (make-source-location "test" ...))
```
