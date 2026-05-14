---
title: just?
---

# Type

```scheme
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# Description

Check if a `maybe-t` value is `just`.

# Examples

```scheme
(just? (just 42))  ;; => true
(just? nothing)    ;; => false
```
