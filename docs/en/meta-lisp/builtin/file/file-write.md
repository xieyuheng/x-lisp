---
title: file-write
---

# Type

```meta-lisp
(-> file-t string-t void-t)
```

# Description

Write a string to a file.

# Examples

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-write file "hello world")
  (file-close file))
```
