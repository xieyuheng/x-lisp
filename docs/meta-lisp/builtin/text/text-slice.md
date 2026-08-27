---
title: text-slice
---

# Type

```meta-lisp
(-> int-t int-t text-t text-t)
```

# Description

Extract a substring from `start` (inclusive) to `end` (exclusive). Indices are in Unicode scalar values.

# Examples

```meta-lisp
(text-slice 0 3 "hello")  ;; => "hel"
(text-slice 1 4 "hello")  ;; => "ell"
(text-slice 0 0 "hello")  ;; => ""
```
