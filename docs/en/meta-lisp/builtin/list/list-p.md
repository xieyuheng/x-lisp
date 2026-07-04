---
title: list?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a list.

# Examples

```meta-lisp
(list? [1 2 3])  ;; => true
(list? "hello")  ;; => false
(list? 42)       ;; => false
```
