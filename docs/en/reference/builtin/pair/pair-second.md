---
title: pair-second
---

# Type

```scheme
(polymorphic (A B) (-> (pair-t A B) B))
```

# Description

Second element of a pair.

# Examples

```scheme
(pair-second (make-pair 1 "hello"))  ;; => "hello"
```
