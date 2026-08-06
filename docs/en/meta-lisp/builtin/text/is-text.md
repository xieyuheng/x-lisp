---
title: is-text
---

# Type

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# Description

Check if a value is a text.

# Examples

```meta-lisp
(is-text "hello")  ;; => true
(is-text 42)       ;; => false
(is-text 'foo)     ;; => false
```
