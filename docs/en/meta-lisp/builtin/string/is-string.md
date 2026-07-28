---
title: is-string
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a string.

# Examples

```meta-lisp
(is-string "hello")  ;; => true
(is-string 42)       ;; => false
(is-string 'foo)     ;; => false
```
