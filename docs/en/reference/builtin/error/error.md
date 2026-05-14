---
title: error
---

# Type

```scheme
(polymorphic (A B) (-> A B))
```

# Description

Throw an error with an arbitrary value as the error message. Does not return.

# Examples

```scheme
(error "something went wrong")
(error 42)
```
