---
title: file-write
---

# Type

```meta-lisp
(-> file-t text-t void-t)
```

# Description

Write a text to a file.

# Examples

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-write file "hello world")
  (file-close file))
```
