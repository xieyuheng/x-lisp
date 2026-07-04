---
title: source-span-t
---

# Type

```meta-lisp
type-t
```

# Description

Source span type. Contains start and end positions.

# Definition

```meta-lisp
(define-struct source-span-t
  (start source-position-t)
  (end source-position-t))
```

# Generated

```meta-lisp
(claim make-source-span (-> source-position-t source-position-t source-span-t))
(claim source-span?     (-> source-span-t bool-t))
(claim source-span-start (-> source-span-t source-position-t))
(claim source-span-end   (-> source-span-t source-position-t))
```
