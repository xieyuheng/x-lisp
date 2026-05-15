---
title: file-close
---

# Type

```scheme
(-> file-t void-t)
```

# Description

Close a file handle.

# Examples

```scheme
(let ((file (open-input-file "data.txt")))
  (file-close file))
```
