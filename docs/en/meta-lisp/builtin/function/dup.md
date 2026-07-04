---
title: dup
---

# Type

```scheme
(polymorphic (A B)
  (-> (-> A A B)
      (-> A B)))
```

# Description

Create a new function that passes the argument twice to the original function.

# Examples

```scheme
((dup iadd) 3)  ;; => 6 (equivalent to (iadd 3 3))
```
