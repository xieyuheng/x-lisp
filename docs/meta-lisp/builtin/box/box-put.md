---
title: box-put
---

# Type

```meta-lisp
(all (E) (-> (box-t E) E void-t))
```

# Description

Store a value in a box. Mutable operation.

# Examples

```meta-lisp
(define box (make-box))
(box-put box 42)
(box-get box) ;; => 42
```
