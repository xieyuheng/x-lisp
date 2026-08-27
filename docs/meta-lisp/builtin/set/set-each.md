---
title: set-each
---

# Type

```meta-lisp
(all (A Any) (-> (-> A Any) (set-t A) void-t))
```

# Description

Apply a side-effecting function to each element.

# Examples

```meta-lisp
(set-each println (@set 1 2 3))
```
