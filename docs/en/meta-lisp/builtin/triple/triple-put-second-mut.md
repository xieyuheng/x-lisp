---
title: triple-put-second!
---

# Type

```meta-lisp
(polymorphic (A B C) (-> B (triple-t A B C) (triple-t A B C)))
```

# Description

Replace the second element of a triple.

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-second! "world" t)
  (triple-second t))  ;; => "world"
```
