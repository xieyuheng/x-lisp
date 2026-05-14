---
title: format-sexp
---

# Type

```scheme
(polymorphic (A) (-> A string-t))
```

# Description

Format an S-expression as a string.

# Examples

```scheme
(format-sexp '(a b c))  ;; => "(a b c)"
(format-sexp 42)        ;; => "42"
```
