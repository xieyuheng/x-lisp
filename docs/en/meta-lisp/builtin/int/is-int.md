---
title: is-int
---

# Type

```meta-lisp
(all (A) (-> A bool-t))
```

# Description

Check if a value is an integer.

# Examples

```meta-lisp
(is-int 42)      ;; => true
(is-int -1)      ;; => true
(is-int 3.14)    ;; => false
(is-int "foo")   ;; => false
```
