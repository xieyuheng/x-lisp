---
title: text-is-float
---

# Type

```meta-lisp
(-> text-t bool-t)
```

# Description

Check if a text is a valid float format.

# Examples

```meta-lisp
(text-is-float "3.14")   ;; => true
(text-is-float "42")     ;; => true
(text-is-float "abc")    ;; => false
```
