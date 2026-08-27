---
title: box-get-maybe
---

# Type

```meta-lisp
(all (E) (-> (box-t E) (maybe-t E)))
```

# Description

Get the value from a box. Returns `(nothing)` if empty, `(just value)` otherwise.

# Examples

```meta-lisp
(define box (make-box))
(box-get-maybe box) ;; => (nothing)
(box-put 42 box)
(box-get-maybe box) ;; => (just 42)
```
