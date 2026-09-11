---
title: set-each
---

# Type

```meta-lisp
(all (A Any) (-> (set-t A) (-> A Any) void-t))
```

# Description

Apply a side-effecting function to each element.

# Examples

```meta-lisp
(set-each (@set 1 2 3) println)
```
