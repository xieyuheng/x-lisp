---
title: pair-put-first
---

# Type

```meta-lisp
(all (A B) (-> A (pair-t A B) (pair-t A B)))
```

# Description

Replace the first element of a pair.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-put-first 7 p)
  (pair-first p))  ;; => 7
```
