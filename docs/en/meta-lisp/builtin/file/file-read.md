---
title: file-read
---

# Type

```meta-lisp
(-> file-t string-t)
```

# Description

Read entire content from a file.

# Examples

```meta-lisp
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
