---
title: format-sexp
---

# Type

```meta-lisp
(-> sexp-t string-t)
```

# Description

Format an S-expression as a string.

# Examples

```meta-lisp
(format-sexp (@sexp (a b c)))  ;; => "(a b c)"
(format-sexp (@sexp 42))       ;; => "42"
```
