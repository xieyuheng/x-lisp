---
title: just-put-value!
---

# Type

```meta-lisp
(polymorphic (A) (-> A (maybe-t A) (maybe-t A)))
```

# Description

Replace the value in a `just`. Errors if called on `nothing`.

# Examples

```meta-lisp
(let ((m (just 42)))
  (just-put-value! 7 m)
  (just-value m))  ;; => 7
```
