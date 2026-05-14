---
title: set-t
---

# Type

```scheme
(-> type-t type-t)
```

# Description

Set type constructor. `(set-t E)` represents a set with element type `E`.

# Examples

```scheme
(claim numbers (set-t int-t))
```
