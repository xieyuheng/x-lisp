---
title: string-to-float
---

# Type

```scheme
(-> string-t float-t)
```

# Description

Parse a string to a float. Behavior is undefined if the string is not a valid float format.

# Examples

```scheme
(string-to-float "3.14")  ;; => 3.14
(string-to-float "42")    ;; => 42.0
(string-to-float "-1.5")  ;; => -1.5
```
