---
title: imod
---

# Type

```scheme
(-> int-t int-t int-t)
```

# Description

Integer modulo. The sign of the result matches the dividend.

# Examples

```scheme
(imod 7 3)    ;; => 1
(imod 6 3)    ;; => 0
(imod -7 3)   ;; => -1
```
