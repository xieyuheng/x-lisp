---
title: pair-put-first
---

# Type

```meta-lisp
(all (A B) (-> (pair-t A B) A void-t))
```

# Description

Replace the first element of a pair.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-put-first p 7)
  (pair-first p))  ;; => 7
```
