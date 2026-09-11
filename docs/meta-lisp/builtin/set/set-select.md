---
title: set-select
---

# Type

```meta-lisp
(all (A) (-> (set-t A) (-> A bool-t) (set-t A)))
```

# Description

Filter elements that satisfy the predicate.

# Examples

```meta-lisp
(set-select (@set -2 -1 0 1 2) int-non-negative?)  ;; => (@set 0 1 2)
```
