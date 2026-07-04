---
title: list-each
---

# Type

```scheme
(polymorphic (A Any) (-> (-> A Any) (list-t A) void-t))
```

# Description

Apply a side-effecting function to each element.

# Examples

```scheme
(list-each println [1 2 3])
;; Output:
;; 1
;; 2
;; 3
```
