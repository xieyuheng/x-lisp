---
title: int-greater-or-equal
---

# Type

```meta-lisp
(-> int-t int-t bool-t)
```

# Description

Check if the first integer is greater than or equal to the second.

# Examples

```meta-lisp
(int-greater-or-equal 2 1)   ;; => true
(int-greater-or-equal 1 1)   ;; => true
(int-greater-or-equal 1 2)   ;; => false
```
