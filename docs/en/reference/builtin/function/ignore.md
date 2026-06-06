---
title: ignore
---

# Type

```scheme
(polymorphic (A) (-> A void-t))
```

# Description

Accepts any value and returns `void`. Used to discard the return value of a function call.

# Examples

```scheme
(ignore (hash-put! 'x 1 (make-hash)))  ;; => void
(ignore 1)                             ;; => void
```
