---
title: string?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a string.

# Examples

```scheme
(string? "hello")  ;; => true
(string? 42)       ;; => false
(string? 'foo)     ;; => false
```
