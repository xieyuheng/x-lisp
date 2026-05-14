---
title: set-each
---

# Type

```scheme
(polymorphic (A Any) (-> (-> A Any) (set-t A) void-t))
```

# Description

Apply a side-effecting function to each element. Derived function.

# Examples

```scheme
(set-each println #{1 2 3})
```
