---
title: format-sexp
---

# Type

```scheme
(-> sexp-t string-t)
```

# Description

Format an S-expression as a string.

# Examples

```scheme
(format-sexp (@sexp (a b c)))  ;; => "(a b c)"
(format-sexp (@sexp 42))       ;; => "42"
```
