---
title: source-location-t
---

# 类型

```meta-lisp
type-t
```

# 描述

源码位置类型。包含文件路径和源码区间。

# 定义

```meta-lisp
(define-struct source-location-t
  (path text-t)
  (span source-span-t))
```

# 自动生成

```meta-lisp
(claim make-source-location (-> text-t source-span-t source-location-t))
(claim is-source-location     (-> source-location-t bool-t))
(claim source-location-path (-> source-location-t text-t))
(claim source-location-span (-> source-location-t source-span-t))
```
