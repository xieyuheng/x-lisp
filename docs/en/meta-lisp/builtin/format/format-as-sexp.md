---
title: format-as-sexp
---

# Type

```scheme
(polymorphic (A) (-> A string-t))
```

# Description

Format an arbitrary value as an S-expression string.

# Examples

```scheme
(format-as-sexp '(a b c))  ;; => "(a b c)"
(format-as-sexp 42)        ;; => "42"
(format-as-sexp "hello")   ;; => "\"hello\""
```
