---
title: text-is-int
---

# Type

```meta-lisp
(-> text-t bool-t)
```

# Description

Check if a text is a valid integer format.

# Examples

```meta-lisp
(text-is-int "42")    ;; => true
(text-is-int "-1")    ;; => true
(text-is-int "3.14")  ;; => false
(text-is-int "abc")   ;; => false
```
