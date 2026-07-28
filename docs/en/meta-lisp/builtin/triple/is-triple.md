---
title: is-triple
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a triple.

# Examples

```meta-lisp
(is-triple (make-triple 1 2 3))  ;; => true
(is-triple 42)                   ;; => false
```
