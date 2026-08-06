---
title: open-input-file
---

# Type

```meta-lisp
(-> text-t file-t)
```

# Description

Open file for reading. Takes a file path, returns a file handle.

# Examples

```meta-lisp
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
