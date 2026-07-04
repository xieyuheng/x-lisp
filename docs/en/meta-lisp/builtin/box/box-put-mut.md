---
title: box-put!
---

# Type

```meta-lisp
(polymorphic (E) (-> E (box-t E) (box-t E)))
```

# Description

Store a value in a box. Mutable operation; also returns the updated box.

# Examples

```meta-lisp
(define box (make-box))
(box-put! 42 box)
(box-get box) ;; => 42
```
