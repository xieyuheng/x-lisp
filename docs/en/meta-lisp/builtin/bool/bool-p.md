---
title: bool?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a boolean.

# Examples

```scheme
(bool? true)   ;; => true
(bool? false)  ;; => true
(bool? 42)     ;; => false
(bool? "foo")  ;; => false
```
