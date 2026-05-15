---
title: println
---

# Type

```scheme
(polymorphic (A) (-> A void-t))
```

# Description

Print any value to standard output followed by a newline.

# Examples

```scheme
(for [i [1 2 3]] (println i))
;; outputs:
;; 1
;; 2
;; 3
```
