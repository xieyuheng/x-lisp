---
title: parse-sexps
---

# Type

```meta-lisp
(-> string-t string-t (list-t sexp-t))
```

# Description

Parse a string into a list of located S-expressions. The first argument is the filename, the second is the source content.

# Examples

```meta-lisp
(parse-sexps "test" "(a b c)")
;; => [(list-sexp [symbol-sexp a ...] ...)]
```
