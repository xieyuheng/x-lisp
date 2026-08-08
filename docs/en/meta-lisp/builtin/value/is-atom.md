---
title: is-atom
---

# Type

```meta-lisp
(all (A) (-> A bool-t))
```

# Description

Check if a value is an atom (a non-list value).

# Examples

```meta-lisp
(is-atom 42)       ;; => true
(is-atom "hello")  ;; => true
(is-atom [1 2 3])  ;; => false
```
