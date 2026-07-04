---
title: nothing
---

# Type

```meta-lisp
(polymorphic (A) (-> (maybe-t A)))
```

# Description

Constructor of `maybe-t`, representing a missing value.

# Examples

```meta-lisp
(let ((m nothing))
  (nothing? m))  ;; => true
```
