---
title: box-empty?
---

# Type

```meta-lisp
(polymorphic (E) (-> (box-t E) bool-t))
```

# Description

Check if a box is empty.

# Examples

```meta-lisp
(define box (make-box))
(box-empty? box) ;; => true
(box-put! 42 box)
(box-empty? box) ;; => false
```
