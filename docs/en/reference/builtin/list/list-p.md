---
title: list?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a list.

# Examples

```scheme
(list? [1 2 3])  ;; => true
(list? "hello")  ;; => false
(list? 42)       ;; => false
```
