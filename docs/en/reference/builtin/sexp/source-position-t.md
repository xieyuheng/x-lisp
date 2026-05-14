---
title: source-position-t
---

# Type

```scheme
type-t
```

# Description

Source position type. Contains index, row, and column.

# Struct

```scheme
(define-struct source-position-t
  (index int-t)
  (row int-t)
  (column int-t))
```

# Generated

```scheme
(claim make-source-position (-> int-t int-t int-t source-position-t))
(claim source-position?     (-> source-position-t bool-t))
(claim source-position-index  (-> source-position-t int-t))
(claim source-position-row    (-> source-position-t int-t))
(claim source-position-column (-> source-position-t int-t))
```
