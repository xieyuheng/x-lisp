---
title: pair-put-second!
---

# Type

```scheme
(polymorphic (A B) (-> B (pair-t A B) (pair-t A B)))
```

# Description

Replace the second element of a pair.

# Examples

```scheme
(pair-put-second! "world" (make-pair 1 "hello"))  ;; => (1 . "world")
```
