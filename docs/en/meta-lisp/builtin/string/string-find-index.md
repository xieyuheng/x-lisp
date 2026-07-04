---
title: string-find-index
---

# Type

```meta-lisp
(-> string-t string-t int-t)
```

# Description

Find the first index of a substring in a string. Returns `-1` if not found.

# Examples

```meta-lisp
(string-find-index "hello" "ll")  ;; => 2
(string-find-index "hello" "x")   ;; => -1
(string-find-index "hello" "")    ;; => 0
```
