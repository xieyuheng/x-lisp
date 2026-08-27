---
title: file-writeln
---

# Type

```meta-lisp
(-> file-t text-t void-t)
```

# Description

Write a text to a file followed by a newline.

# Examples

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-writeln file "hello")
  (file-writeln file "world")
  (file-close file))
```
