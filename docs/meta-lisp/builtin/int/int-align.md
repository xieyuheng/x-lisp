---
title: int-align
---

# Type

```meta-lisp
(-> int-t int-t int-t)
```

# Description

Align integer `n` upward to a multiple of `alignment`.

# Examples

```meta-lisp
(int-align 16 8)    ;; => 16
(int-align 16 16)   ;; => 16
(int-align 16 24)   ;; => 32
```
