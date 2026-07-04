---
title: bool?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a boolean.

# Examples

```meta-lisp
(bool? true)   ;; => true
(bool? false)  ;; => true
(bool? 42)     ;; => false
(bool? "foo")  ;; => false
```
