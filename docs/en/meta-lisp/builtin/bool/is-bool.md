---
title: is-bool
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a boolean.

# Examples

```meta-lisp
(is-bool true)   ;; => true
(is-bool false)  ;; => true
(is-bool 42)     ;; => false
(is-bool "foo")  ;; => false
```
