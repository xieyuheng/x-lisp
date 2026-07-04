---
title: just?
---

# Type

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# Description

Check if a `maybe-t` value is `just`.

# Examples

```meta-lisp
(just? (just 42))  ;; => true
(just? nothing)    ;; => false
```
