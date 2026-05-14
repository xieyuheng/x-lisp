---
title: just-value
---

# Type

```scheme
(polymorphic (A) (-> (maybe-t A) A))
```

# Description

Extract the value from a `just`. Errors if called on `nothing`.

# Examples

```scheme
(just-value (just 42))  ;; => 42
```
