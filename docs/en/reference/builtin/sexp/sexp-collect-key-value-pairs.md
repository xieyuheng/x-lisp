---
title: sexp-collect-key-value-pairs
---

# Type

```scheme
(-> (list-t sexp-t) (list-t (pair-t keyword-t sexp-t)))
```

# Description

Collect key-value pairs from a list of located S-expressions. When encountering a keyword-prefixed sexp, uses the keyword as key and the next sexp as value.

# Examples

```scheme
(sexp-collect-key-value-pairs
  [keyword-sexp :key ... int-sexp 42 ...])
;; => [(make-pair :key int-sexp-42)]
```
