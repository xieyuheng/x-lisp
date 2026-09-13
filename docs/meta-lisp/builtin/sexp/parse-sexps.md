---
title: parse-sexps
---

# Type

```meta-lisp
(-> text-t source-position-t text-t (list-t sexp-t))
```

# Description

Parse a text into a list of located S-expressions.

The first argument is the filename.
The second argument is the starting source position.
The third argument is the source content.

# Examples

```meta-lisp
(parse-sexps "test" (make-source-position 0 0 0) "(a b c)")
;; => (@list (list-sexp (@list symbol-sexp a ...) ...))
```
