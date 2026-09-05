---
title: path-list
---

# Type

```meta-lisp
(-> text-t (list-t text-t))
```

# Description

List directory contents.

# Examples

```meta-lisp
(path-list "/tmp")  ;; => (@list "a.txt" "b.txt" "subdir")
```
