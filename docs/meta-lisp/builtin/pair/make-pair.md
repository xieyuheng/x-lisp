---
title: make-pair
---

# Type

```meta-lisp
(all (A B) (-> A B (pair-t A B)))
```

# Description

Constructor of `pair-t`, constructs a pair with two values.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
