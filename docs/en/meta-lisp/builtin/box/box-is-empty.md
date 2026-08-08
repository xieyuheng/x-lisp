---
title: box-is-empty
---

# Type

```meta-lisp
(all (E) (-> (box-t E) bool-t))
```

# Description

Check if a box is empty.

# Examples

```meta-lisp
(define box (make-box))
(box-is-empty box) ;; => true
(box-put 42 box)
(box-is-empty box) ;; => false
```
