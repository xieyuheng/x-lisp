---
title: hash-code
---

# Type

```scheme
(polymorphic (A) (-> A int-t))
```

# Description

Compute the hash code of any value.

# Examples

```scheme
(hash-code 42)       ;; => 42
(hash-code "hello")  ;; => some integer
```
