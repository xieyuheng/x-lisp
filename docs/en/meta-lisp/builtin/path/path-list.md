---
title: path-list
---

# Type

```meta-lisp
(-> string-t (list-t string-t))
```

# Description

List directory contents.

# Examples

```meta-lisp
(path-list "/tmp")  ;; => ["a.txt" "b.txt" "subdir"]
```
