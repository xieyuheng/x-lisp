---
title: source-location-t
---

# Type

```meta-lisp
type-t
```

# Description

Source location type. Contains file path and source span.

# Definition

```meta-lisp
(define-struct source-location-t
  (path text-t)
  (span source-span-t))
```

# Generated

```meta-lisp
(claim make-source-location (-> text-t source-span-t source-location-t))
(claim source-location?     (-> source-location-t bool-t))
(claim source-location-path (-> source-location-t text-t))
(claim source-location-span (-> source-location-t source-span-t))
```
