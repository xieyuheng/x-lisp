---
title: int-align
---

# Type

```scheme
(-> int-t int-t int-t)
```

# Description

Align integer `n` upward to a multiple of `alignment`. Derived function.

# Examples

```scheme
(int-align 16 8)    ;; => 16
(int-align 16 16)   ;; => 16
(int-align 16 24)   ;; => 32
```
