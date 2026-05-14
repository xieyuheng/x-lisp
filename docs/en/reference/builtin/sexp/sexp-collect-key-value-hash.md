---
title: sexp-collect-key-value-hash
---

# Type

```scheme
(-> (list-t located-sexp-t) (hash-t keyword-t located-sexp-t))
```

# Description

Collect key-value pairs from a list of located S-expressions into a hash. Similar to `sexp-collect-key-value-pairs` but returns a hash. Derived function.

# Examples

```scheme
(sexp-collect-key-value-hash
  [keyword-sexp :key ... int-sexp 42 ...])
;; => @{:key int-sexp-42}
```
