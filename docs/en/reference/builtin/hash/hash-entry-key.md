---
title: hash-entry-key
---

# Type

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) K))
```

# Description

Get the key of an entry.

# Examples

```scheme
(hash-entry-key (make-hash-entry "a" 1))  ;; => "a"
```
