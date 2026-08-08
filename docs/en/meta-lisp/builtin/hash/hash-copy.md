---
title: hash-copy
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (hash-t K V)))
```

# Description

Copy a hash table, returning a new hash table.

# Examples

```meta-lisp
(let* ((h1 (@hash "a" 1 "b" 2))
       (h2 (hash-copy h1)))
  (hash-put "c" 3 h2)
  (list h1 h2))
;; => [(@hash "a" 1 "b" 2) (@hash "a" 1 "b" 2 "c" 3)]
```
