---
title: parse-sexps
---

# Type

```scheme
(-> string-t string-t (list-t located-sexp-t))
```

# Description

Parse a string into a list of located S-expressions. The first argument is the filename, the second is the source content.

# Examples

```scheme
(parse-sexps "test" "(a b c)")
;; => [(list-sexp [symbol-sexp a ...] ...)]
```
