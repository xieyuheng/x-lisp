---
title: keyword?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a keyword.

# Examples

```scheme
(keyword? :key)    ;; => true
(keyword? 'key)    ;; => false
(keyword? "key")   ;; => false
```
