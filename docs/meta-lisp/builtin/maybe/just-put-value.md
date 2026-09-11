---
title: just-put-value
---

# Type

```meta-lisp
(all (A) (-> (maybe-t A) A void-t))
```

# Description

Replace the value in a `just`. Errors if called on `nothing`.

# Examples

```meta-lisp
(let ((m (just 42)))
  (just-put-value m 7)
  (just-value m))  ;; => 7
```
