---
title: source-position-t
---

# 类型

```scheme
type-t
```

# 描述

源码位置类型。包含索引、行号和列号。

# 结构体

```scheme
(define-struct source-position-t
  (index int-t)
  (row int-t)
  (column int-t))
```

# 自动生成

```scheme
(claim make-source-position (-> int-t int-t int-t source-position-t))
(claim source-position?     (-> source-position-t bool-t))
(claim source-position-index  (-> source-position-t int-t))
(claim source-position-row    (-> source-position-t int-t))
(claim source-position-column (-> source-position-t int-t))
```
