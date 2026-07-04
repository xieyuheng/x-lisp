---
title: atom?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is an atom (a non-list value).

# Examples

```meta-lisp
(atom? 42)       ;; => true
(atom? "hello")  ;; => true
(atom? [1 2 3])  ;; => false
```
