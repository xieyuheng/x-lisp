---
title: void?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is `void`.

# Examples

```meta-lisp
(void? void)    ;; => true
(void? 42)      ;; => false
```
