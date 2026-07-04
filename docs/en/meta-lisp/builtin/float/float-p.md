---
title: float?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a float.

# Examples

```meta-lisp
(float? 3.14)    ;; => true
(float? 42)      ;; => false
(float? "foo")   ;; => false
```
