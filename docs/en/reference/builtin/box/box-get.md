---
title: box-get
---

# Type

```scheme
(polymorphic (E) (-> (box-t E) E))
```

# Description

Get the value from a box. Throws an error if the box is empty.

# Examples

```scheme
(define box (make-box))
(box-put! 42 box)
(box-get box) ;; => 42
```
