---
title: string-is-int
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string is a valid integer format.

# Examples

```meta-lisp
(string-is-int "42")    ;; => true
(string-is-int "-1")    ;; => true
(string-is-int "3.14")  ;; => false
(string-is-int "abc")   ;; => false
```
