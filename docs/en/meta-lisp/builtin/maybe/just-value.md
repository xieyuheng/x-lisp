---
title: just-value
---

# Type

```meta-lisp
(all (A) (-> (maybe-t A) A))
```

# Description

Extract the value from a `just`. Errors if called on `nothing`.

# Examples

```meta-lisp
(just-value (just 42))  ;; => 42
;; (just-value nothing)  ;; error: cannot get value from nothing
```
