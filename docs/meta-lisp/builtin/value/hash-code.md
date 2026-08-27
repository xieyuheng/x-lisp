---
title: hash-code
---

# Type

```meta-lisp
(all (A) (-> A int-t))
```

# Description

Compute the hash code of any value.

# Examples

```meta-lisp
(hash-code 42)       ;; => 42
(hash-code "hello")  ;; => some integer
```
