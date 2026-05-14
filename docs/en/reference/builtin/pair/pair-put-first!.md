---
title: pair-put-first!
---

# Type

```scheme
(polymorphic (A B) (-> A (pair-t A B) (pair-t A B)))
```

# Description

Replace the first element of a pair.

# Examples

```scheme
(pair-put-first! 7 (make-pair 1 "hello"))  ;; => (7 . "hello")
```
