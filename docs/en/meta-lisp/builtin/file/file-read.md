---
title: file-read
---

# Type

```scheme
(-> file-t string-t)
```

# Description

Read entire content from a file.

# Examples

```scheme
(let ((file (open-input-file "data.txt")))
  (file-read file)
  (file-close file))
```
