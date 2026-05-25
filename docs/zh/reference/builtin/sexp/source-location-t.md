---
title: source-location-t
---

# 类型

```scheme
type-t
```

# 描述

源码位置类型。包含文件路径和源码区间。

# 定义

```scheme
(define-struct source-location-t
  (path string-t)
  (span source-span-t))
```

# 自动生成

```scheme
(claim make-source-location (-> string-t source-span-t source-location-t))
(claim source-location?     (-> source-location-t bool-t))
(claim source-location-path (-> source-location-t string-t))
(claim source-location-span (-> source-location-t source-span-t))
```
