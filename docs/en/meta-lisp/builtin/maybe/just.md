---
title: just
---

# Type

```scheme
(polymorphic (A) (-> A (maybe-t A)))
```

# Description

Constructor of `maybe-t`, representing a present value.

# Examples

```scheme
(let ((m (just 42)))
  (just? m))       ;; => true
```
