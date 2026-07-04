---
title: float-less-or-equal?
---

# Type

```scheme
(-> float-t float-t bool-t)
```

# Description

Check if the first float is less than or equal to the second.

# Examples

```scheme
(float-less-or-equal? 1.0 2.0)   ;; => true
(float-less-or-equal? 1.0 1.0)   ;; => true
(float-less-or-equal? 2.0 1.0)   ;; => false
```
