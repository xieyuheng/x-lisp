---
title: make-hash-entry
---

# Type

```meta-lisp
(polymorphic (K V) (-> K V (hash-entry-t K V)))
```

# Description

Constructor of `hash-entry-t`, creates a key-value entry.

# Examples

```meta-lisp
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
