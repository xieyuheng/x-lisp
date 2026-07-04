---
title: hash-entry-value
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-entry-t K V) V))
```

# Description

Get the value of an entry.

# Examples

```meta-lisp
(let ((entries (hash-entries (@hash 'a 1 'b 2))))
  (list-map hash-entry-value entries))  ;; => [1 2]
```
