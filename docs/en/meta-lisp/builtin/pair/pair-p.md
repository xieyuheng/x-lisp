---
title: pair?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a pair.

# Examples

```meta-lisp
(pair? (make-pair 1 2))  ;; => true
(pair? 42)               ;; => false
```
