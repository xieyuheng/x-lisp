---
title: is-float
---

# Type

```meta-lisp
(all (A) (-> A bool-t))
```

# Description

Check if a value is a float.

# Examples

```meta-lisp
(is-float 3.14)    ;; => true
(is-float 42)      ;; => false
(is-float "foo")   ;; => false
```
