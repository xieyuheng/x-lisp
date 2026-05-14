---
title: just-put-value!
---

# Type

```scheme
(polymorphic (A) (-> A (maybe-t A) (maybe-t A)))
```

# Description

Replace the value in a `just`. Errors if called on `nothing`.

# Examples

```scheme
(just-put-value! 7 (just 42))  ;; => (just 7)
```
