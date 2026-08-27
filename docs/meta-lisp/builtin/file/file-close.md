---
title: file-close
---

# Type

```meta-lisp
(-> file-t void-t)
```

# Description

Close a file handle.

# Examples

```meta-lisp
(let ((file (open-input-file "data.txt")))
  (file-close file))
```
