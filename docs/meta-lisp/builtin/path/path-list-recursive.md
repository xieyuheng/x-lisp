---
title: path-list-recursive
---

# Type

```meta-lisp
(-> text-t (list-t text-t))
```

# Description

List directory contents recursively.

# Examples

```meta-lisp
(path-list-recursive "/tmp")  ;; => (@list "/tmp/a.txt" "/tmp/subdir/b.txt")
```
