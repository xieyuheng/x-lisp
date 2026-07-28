---
title: is-just
---

# Type

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# Description

Check if a `maybe-t` value is `just`.

# Examples

```meta-lisp
(is-just (just 42))  ;; => true
(is-just nothing)    ;; => false
```
