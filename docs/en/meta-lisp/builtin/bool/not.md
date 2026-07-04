---
title: not
---

# Type

```meta-lisp
(-> bool-t bool-t)
```

# Description

Logical not. Turns `true` to `false` and `false` to `true`.

# Examples

```meta-lisp
(not true)   ;; => false
(not false)  ;; => true
(not (not true))  ;; => true
```
