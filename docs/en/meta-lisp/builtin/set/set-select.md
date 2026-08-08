---
title: set-select
---

# Type

```meta-lisp
(all (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# Description

Filter elements that satisfy the predicate.

# Examples

```meta-lisp
(set-select int-non-negative? (@set -2 -1 0 1 2))  ;; => (@set 0 1 2)
```
