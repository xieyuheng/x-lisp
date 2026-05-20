---
title: float?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a float.

# Examples

```scheme
(float? 3.14)    ;; => true
(float? 42)      ;; => false
(float? "foo")   ;; => false
```
