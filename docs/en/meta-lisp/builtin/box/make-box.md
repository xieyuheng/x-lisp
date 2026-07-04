---
title: make-box
---

# Type

```scheme
(polymorphic (E) (-> (box-t E)))
```

# Description

Create an empty box.

# Examples

```scheme
(define box (make-box))
(box-empty? box) ;; => true
```
