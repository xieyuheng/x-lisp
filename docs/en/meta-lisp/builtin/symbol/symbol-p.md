---
title: symbol?
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a symbol.

# Examples

```meta-lisp
(symbol? 'foo)    ;; => true
(symbol? "foo")   ;; => false
(symbol? 42)      ;; => false
```
