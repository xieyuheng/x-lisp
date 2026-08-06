---
title: format-sexp
---

# Type

```meta-lisp
(-> sexp-t text-t)
```

# Description

Format an S-expression as a text.

# Examples

```meta-lisp
(format-sexp (@sexp (a b c)))  ;; => "(a b c)"
(format-sexp (@sexp 42))       ;; => "42"
```
