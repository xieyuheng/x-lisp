---
title: random-float
---

# Type

```scheme
(-> float-t float-t float-t)
```

# Description

Generate a random float in the range [min, max).

# Examples

```scheme
(random-float 0.0 1.0)   ;; => random float from 0.0 to 1.0
(random-float -1.0 1.0)  ;; => random float from -1.0 to 1.0
```
