---
title: pair?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a pair.

# Examples

```scheme
(pair? (make-pair 1 2))  ;; => true
(pair? 42)               ;; => false
```
