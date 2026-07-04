---
title: source-span-t
---

# Type

```scheme
type-t
```

# Description

Source span type. Contains start and end positions.

# Definition

```scheme
(define-struct source-span-t
  (start source-position-t)
  (end source-position-t))
```

# Generated

```scheme
(claim make-source-span (-> source-position-t source-position-t source-span-t))
(claim source-span?     (-> source-span-t bool-t))
(claim source-span-start (-> source-span-t source-position-t))
(claim source-span-end   (-> source-span-t source-position-t))
```
