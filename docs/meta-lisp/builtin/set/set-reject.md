---
title: set-reject
---

# Type

```meta-lisp
(all (A) (-> (set-t A) (-> A bool-t) (set-t A)))
```

# Description

Remove elements that satisfy the predicate.

# Examples

```meta-lisp
(set-reject (@set -2 -1 0 1 2) int-non-negative?)  ;; => (@set -2 -1)
```
