---
title: pair-put-second
---

# Type

```meta-lisp
(polymorphic (A B) (-> B (pair-t A B) (pair-t A B)))
```

# Description

Replace the second element of a pair.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-put-second "world" p)
  (pair-second p))  ;; => "world"
```
