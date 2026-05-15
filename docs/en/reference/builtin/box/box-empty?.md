---
title: box-empty?
---

# Type

```scheme
(polymorphic (E) (-> (box-t E) bool-t))
```

# Description

Check if a box is empty.

# Examples

```scheme
(define box (make-box))
(box-empty? box) ;; => true
(box-put! 42 box)
(box-empty? box) ;; => false
```
