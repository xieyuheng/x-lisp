---
title: hash-keys
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (list-t K)))
```

# Description

Get all keys of a hash table as a list.

# Examples

```meta-lisp
(let ((keys (hash-keys (@hash 1 2 3 4))))
  (list-map (iadd 1) keys))  ;; => (@list 2 4)
```
