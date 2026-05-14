---
title: source-span-t
---

# 类型

```scheme
type-t
```

# 描述

源码区间类型。包含起始和结束位置。

# 结构体

```scheme
(define-struct source-span-t
  (start source-position-t)
  (end source-position-t))
```

# 自动生成

```scheme
(claim make-source-span (-> source-position-t source-position-t source-span-t))
(claim source-span?     (-> source-span-t bool-t))
(claim source-span-start (-> source-span-t source-position-t))
(claim source-span-end   (-> source-span-t source-position-t))
```
