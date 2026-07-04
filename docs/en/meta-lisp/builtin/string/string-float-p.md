---
title: string-float?
---

# Type

```scheme
(-> string-t bool-t)
```

# Description

Check if a string is a valid float format.

# Examples

```scheme
(string-float? "3.14")   ;; => true
(string-float? "42")     ;; => true
(string-float? "abc")    ;; => false
```
