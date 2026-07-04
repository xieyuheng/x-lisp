---
title: string-float?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string is a valid float format.

# Examples

```meta-lisp
(string-float? "3.14")   ;; => true
(string-float? "42")     ;; => true
(string-float? "abc")    ;; => false
```
