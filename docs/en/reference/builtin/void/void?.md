---
title: void?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is `void`.

# Examples

```scheme
(void? void)    ;; => true
(void? 42)      ;; => false
```
