---
title: parse-sexps
---

# Type

```meta-lisp
(-> text-t text-t (list-t sexp-t))
```

# Description

Parse a text into a list of located S-expressions. The first argument is the filename, the second is the source content.

# Examples

```meta-lisp
(parse-sexps "test" "(a b c)")
;; => (@list (list-sexp (@list symbol-sexp a ...) ...))
```
