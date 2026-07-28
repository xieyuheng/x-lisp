---
title: is-symbol
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a symbol.

# Examples

```meta-lisp
(is-symbol 'foo)    ;; => true
(is-symbol "foo")   ;; => false
(is-symbol 42)      ;; => false
```
