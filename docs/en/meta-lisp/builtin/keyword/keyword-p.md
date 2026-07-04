---
title: keyword?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a keyword.

# Examples

```meta-lisp
(keyword? :key)    ;; => true
(keyword? 'key)    ;; => false
(keyword? "key")   ;; => false
```
