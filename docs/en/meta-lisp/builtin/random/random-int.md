---
title: random-int
---

# Type

```meta-lisp
(-> int-t int-t int-t)
```

# Description

Generate a random integer in the range [min, max).

# Examples

```meta-lisp
(random-int 1 10)   ;; => random integer from 1 to 9
(random-int 0 100)  ;; => random integer from 0 to 99
```
