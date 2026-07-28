---
title: string-is-float
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string is a valid float format.

# Examples

```meta-lisp
(string-is-float "3.14")   ;; => true
(string-is-float "42")     ;; => true
(string-is-float "abc")    ;; => false
```
