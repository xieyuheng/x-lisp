---
title: fs-file?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a path is a file.

# Examples

```meta-lisp
(fs-file? "/tmp/foo.txt")  ;; => true or false
```
