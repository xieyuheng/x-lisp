---
title: make-hash-entry
---

# Type

```scheme
(polymorphic (K V) (-> K V (hash-entry-t K V)))
```

# Description

Constructor of `hash-entry-t`, creates a key-value entry.

# Examples

```scheme
(make-hash-entry "a" 1)  ;; => (hash-entry-t "a" . 1)
```
