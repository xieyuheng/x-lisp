---
title: list-t
---

# Type

```scheme
(-> type-t type-t)
```

# Description

List type constructor. `(list-t E)` represents a list with element type `E`.

# Examples

```scheme
(claim numbers (list-t int-t))
(claim names (list-t string-t))
```
