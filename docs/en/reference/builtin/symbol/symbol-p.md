---
title: symbol?
---

# Type

```scheme
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a symbol.

# Examples

```scheme
(symbol? 'foo)    ;; => true
(symbol? "foo")   ;; => false
(symbol? 42)      ;; => false
```
