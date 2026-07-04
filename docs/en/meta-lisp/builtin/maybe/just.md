---
title: just
---

# Type

```meta-lisp
(polymorphic (A) (-> A (maybe-t A)))
```

# Description

Constructor of `maybe-t`, representing a present value.

# Examples

```meta-lisp
(let ((m (just 42)))
  (just? m))       ;; => true
```
