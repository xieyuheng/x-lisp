---
title: pair-second
---

# Type

```meta-lisp
(all (A B) (-> (pair-t A B) B))
```

# Description

Second element of a pair.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-second p))  ;; => "hello"
```
