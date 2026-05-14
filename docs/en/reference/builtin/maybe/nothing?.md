---
title: nothing?
---

# Type

```scheme
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# Description

Check if a `maybe-t` value is `nothing`.

# Examples

```scheme
(nothing? nothing)    ;; => true
(nothing? (just 42))  ;; => false
```
