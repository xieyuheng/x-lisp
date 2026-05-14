---
title: float-greater?
---

# Type

```scheme
(-> float-t float-t bool-t)
```

# Description

Check if the first float is greater than the second.

# Examples

```scheme
(float-greater? 2.0 1.0)    ;; => true
(float-greater? 1.0 2.0)    ;; => false
(float-greater? 1.0 1.0)    ;; => false
```
