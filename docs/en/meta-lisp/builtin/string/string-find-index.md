---
title: string-find-index
---

# Type

```scheme
(-> string-t string-t int-t)
```

# Description

Find the first index of a substring in a string. Returns `-1` if not found.

# Examples

```scheme
(string-find-index "hello" "ll")  ;; => 2
(string-find-index "hello" "x")   ;; => -1
(string-find-index "hello" "")    ;; => 0
```
