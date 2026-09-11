---
title: text-slice
---

# Type

```meta-lisp
(-> text-t int-t int-t text-t)
```

# Description

Extract a substring from `start` (inclusive) to `end` (exclusive). Indices are in Unicode scalar values.

# Examples

```meta-lisp
(text-slice "hello" 0 3)  ;; => "hel"
(text-slice "hello" 1 4)  ;; => "ell"
(text-slice "hello" 0 0)  ;; => ""
```
