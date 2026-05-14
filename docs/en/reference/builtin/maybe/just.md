---
title: just
---

# Type

```scheme
(polymorphic (A) (-> A (maybe-t A)))
```

# Description

Constructor of `maybe-t`, representing a present value.

# Examples

```scheme
(just 42)    ;; a maybe value containing 42
(just "hi")  ;; a maybe value containing "hi"
```
