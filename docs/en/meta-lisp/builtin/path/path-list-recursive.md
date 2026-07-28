---
title: path-list-recursive
---

# Type

```meta-lisp
(-> string-t (list-t string-t))
```

# Description

List directory contents recursively.

# Examples

```meta-lisp
(path-list-recursive "/tmp")  ;; => ["/tmp/a.txt" "/tmp/subdir/b.txt"]
```
