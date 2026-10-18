---
title: "null"
---

# Type

```meta-lisp
(all (E) (list-t E))
```

# Description

The empty list. `(@list)` evaluates to `null`. It is printed as `#null`.

# Examples

```meta-lisp
null           ;; => #null
(@list)        ;; => #null
(list-is-empty null)  ;; => #t
```
