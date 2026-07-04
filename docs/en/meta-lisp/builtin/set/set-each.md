---
title: set-each
---

# Type

```meta-lisp
(polymorphic (A Any) (-> (-> A Any) (set-t A) void-t))
```

# Description

Apply a side-effecting function to each element.

# Examples

```meta-lisp
(set-each println #{1 2 3})
```
