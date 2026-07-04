---
title: nothing?
---

# Type

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# Description

Check if a `maybe-t` value is `nothing`.

# Examples

```meta-lisp
(nothing? nothing)    ;; => true
(nothing? (just 42))  ;; => false
```
