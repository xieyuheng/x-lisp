---
title: string-to-int
---

# Type

```meta-lisp
(-> string-t int-t)
```

# Description

Parse a string to an integer. Behavior is undefined if the string is not a valid integer format.

# Examples

```meta-lisp
(string-to-int "42")    ;; => 42
(string-to-int "-1")    ;; => -1
(string-to-int "0")     ;; => 0
```
