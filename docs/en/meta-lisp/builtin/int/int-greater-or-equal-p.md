---
title: int-greater-or-equal?
---

# Type

```scheme
(-> int-t int-t bool-t)
```

# Description

Check if the first integer is greater than or equal to the second.

# Examples

```scheme
(int-greater-or-equal? 2 1)   ;; => true
(int-greater-or-equal? 1 1)   ;; => true
(int-greater-or-equal? 1 2)   ;; => false
```
