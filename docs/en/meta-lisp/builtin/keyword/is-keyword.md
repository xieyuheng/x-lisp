---
title: is-keyword
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a keyword.

# Examples

```meta-lisp
(is-keyword :key)    ;; => true
(is-keyword 'key)    ;; => false
(is-keyword "key")   ;; => false
```
