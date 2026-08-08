---
title: is-list
---

# Type

```meta-lisp
(all (A) (-> A bool-t))
```

# Description

Check if a value is a list.

# Examples

```meta-lisp
(is-list [1 2 3])  ;; => true
(is-list "hello")  ;; => false
(is-list 42)       ;; => false
```
