---
title: box-get
---

# Type

```meta-lisp
(all (E) (-> (box-t E) E))
```

# Description

Get the value from a box. Throws an error if the box is empty.

# Examples

```meta-lisp
(define box (make-box))
(box-put box 42)
(box-get box) ;; => 42
```
