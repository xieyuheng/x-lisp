---
title: string-compare-lexical
---

# Type

```meta-lisp
(-> string-t string-t int-t)
```

# Description

Lexicographic comparison. Returns `-1` if the first is less than the second, `0` if equal, `1` if greater.

# Examples

```meta-lisp
(string-compare-lexical "a" "b")  ;; => -1
(string-compare-lexical "a" "a")  ;; => 0
(string-compare-lexical "b" "a")  ;; => 1
```
