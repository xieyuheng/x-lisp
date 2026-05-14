---
title: source-location-t
---

# Type

```scheme
type-t
```

# Description

Source location type. Contains file path and source span.

# Struct

```scheme
(define-struct source-location-t
  (path string-t)
  (span source-span-t))
```

# Generated

```scheme
(claim make-source-location (-> string-t source-span-t source-location-t))
(claim source-location?     (-> source-location-t bool-t))
(claim source-location-path (-> source-location-t string-t))
(claim source-location-span (-> source-location-t source-span-t))
```
