---
title: pair-first
---

# Type

```scheme
(polymorphic (A B) (-> (pair-t A B) A))
```

# Description

First element of a pair.

# Examples

```scheme
(pair-first (make-pair 1 "hello"))  ;; => 1
```
