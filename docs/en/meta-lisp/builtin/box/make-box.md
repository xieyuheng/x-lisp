---
title: make-box
---

# Type

```meta-lisp
(all (E) (-> (box-t E)))
```

# Description

Create an empty box.

# Examples

```meta-lisp
(define box (make-box))
(box-empty? box) ;; => true
```
