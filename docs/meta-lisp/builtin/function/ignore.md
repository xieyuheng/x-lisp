---
title: ignore
---

# Type

```meta-lisp
(all (A) (-> A void-t))
```

# Description

Accepts any value and returns `void`. Used to discard the return value of a function call.

# Examples

```meta-lisp
(ignore (hash-put (make-hash) 'x 1))  ;; => void
(ignore 1)                             ;; => void
```
