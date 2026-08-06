---
title: open-output-file
---

# Type

```meta-lisp
(-> text-t file-t)
```

# Description

Open file for writing. Takes a file path, returns a file handle. Creates the file if it doesn't exist, overwrites if it does.

# Examples

```meta-lisp
(let ((file (open-output-file "output.txt")))
  (file-writeln "hello" file)
  (file-close file))
```
