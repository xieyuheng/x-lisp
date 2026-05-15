---
title: hash-entry-value
---

# Type

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) V))
```

# Description

Get the value of an entry.

# Examples

```scheme
(hash-entry-value (make-hash-entry "a" 1))  ;; => 1
```
