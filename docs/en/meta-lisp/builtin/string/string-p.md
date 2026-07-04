---
title: string?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a string.

# Examples

```meta-lisp
(string? "hello")  ;; => true
(string? 42)       ;; => false
(string? 'foo)     ;; => false
```
