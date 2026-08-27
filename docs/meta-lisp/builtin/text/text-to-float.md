---
title: text-to-float
---

# Type

```meta-lisp
(-> text-t float-t)
```

# Description

Parse a text to a float. Behavior is undefined if the text is not a valid float format.

# Examples

```meta-lisp
(text-to-float "3.14")  ;; => 3.14
(text-to-float "42")    ;; => 42.0
(text-to-float "-1.5")  ;; => -1.5
```
