---
title: pair-first
---

# Type

```meta-lisp
(all (A B) (-> (pair-t A B) A))
```

# Description

First element of a pair.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))  ;; => 1
```
