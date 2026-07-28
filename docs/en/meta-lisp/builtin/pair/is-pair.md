---
title: is-pair
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a pair.

# Examples

```meta-lisp
(is-pair (make-pair 1 2))  ;; => true
(is-pair 42)               ;; => false
```
