---
title: string-int?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string is a valid integer format.

# Examples

```meta-lisp
(string-int? "42")    ;; => true
(string-int? "-1")    ;; => true
(string-int? "3.14")  ;; => false
(string-int? "abc")   ;; => false
```
