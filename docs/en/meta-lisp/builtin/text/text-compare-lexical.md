---
title: text-compare-lexical
---

# Type

```meta-lisp
(-> text-t text-t int-t)
```

# Description

Lexicographic comparison. Returns `-1` if the first is less than the second, `0` if equal, `1` if greater.

# Examples

```meta-lisp
(text-compare-lexical "a" "b")  ;; => -1
(text-compare-lexical "a" "a")  ;; => 0
(text-compare-lexical "b" "a")  ;; => 1
```
