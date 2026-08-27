---
title: nothing
---

# Type

```meta-lisp
(all (A) (-> (maybe-t A)))
```

# Description

Constructor of `maybe-t`, representing a missing value.

# Examples

```meta-lisp
(let ((m nothing))
  (is-nothing m))  ;; => true
```
