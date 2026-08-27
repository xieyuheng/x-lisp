---
title: format-as-sexp
---

# Type

```meta-lisp
(all (A) (-> A text-t))
```

# Description

Format an arbitrary value as an S-expression text.

# Examples

```meta-lisp
(format-as-sexp '(a b c))  ;; => "(a b c)"
(format-as-sexp 42)        ;; => "42"
(format-as-sexp "hello")   ;; => "\"hello\""
```
