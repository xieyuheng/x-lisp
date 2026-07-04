---
title: fs-list-recursive
---

# Type

```scheme
(-> string-t (list-t string-t))
```

# Description

List directory contents recursively.

# Examples

```scheme
(fs-list-recursive "/tmp")  ;; => ["/tmp/a.txt" "/tmp/subdir/b.txt"]
```
