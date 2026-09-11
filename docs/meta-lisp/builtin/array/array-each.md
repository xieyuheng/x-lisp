---
title: array-each
---

# Type

```meta-lisp
(all (A Any) (-> (array-t A) (-> A Any) void-t))
```

# Description

Iterate over the elements with side effects.

# Examples

```meta-lisp
(array-each (@array 1 2 3) print)
```
