---
title: string-substring
---

# Type

```scheme
(-> int-t int-t string-t string-t)
```

# Description

Extract a substring from `start` (inclusive) to `end` (exclusive). Indices are in Unicode scalar values.

# Examples

```scheme
(string-substring 0 3 "hello")  ;; => "hel"
(string-substring 1 4 "hello")  ;; => "ell"
(string-substring 0 0 "hello")  ;; => ""
```
