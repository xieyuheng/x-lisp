---
title: int?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is an integer.

# Examples

```meta-lisp
(int? 42)      ;; => true
(int? -1)      ;; => true
(int? 3.14)    ;; => false
(int? "foo")   ;; => false
```
