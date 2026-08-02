---
title: ignore
---

# Type

```meta-lisp
(polymorphic (A) (-> A void-t))
```

# Description

Accepts any value and returns `void`. Used to discard the return value of a function call.

# Examples

```meta-lisp
(ignore (hash-put 'x 1 (make-hash)))  ;; => void
(ignore 1)                             ;; => void
```
