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
(text-find-index "ll" "hello")  ;; => 2
(text-find-index "x" "hello")   ;; => -1
(text-find-index "" "hello")    ;; => 0
```
