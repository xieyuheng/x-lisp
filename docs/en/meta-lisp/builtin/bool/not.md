---
title: not
---

# Type

```scheme
(-> bool-t bool-t)
```

# Description

Logical not. Turns `true` to `false` and `false` to `true`.

# Examples

```scheme
(not true)   ;; => false
(not false)  ;; => true
(not (not true))  ;; => true
```
