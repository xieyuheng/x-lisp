---
title: text-find-index
---

# Type

```meta-lisp
(-> text-t text-t int-t)
```

# Description

Find the first index of a substring in a text. Returns `-1` if not found.

# Examples

```meta-lisp
(text-find-index "hello" "ll")  ;; => 2
(text-find-index "hello" "x")   ;; => -1
(text-find-index "hello" "")    ;; => 0
```
