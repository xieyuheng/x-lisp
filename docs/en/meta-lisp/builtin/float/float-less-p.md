---
title: float-less?
---

# Type

```scheme
(-> float-t float-t bool-t)
```

# Description

Check if the first float is less than the second.

# Examples

```scheme
(float-less? 1.0 2.0)     ;; => true
(float-less? 2.0 1.0)     ;; => false
(float-less? 1.0 1.0)     ;; => false
```
