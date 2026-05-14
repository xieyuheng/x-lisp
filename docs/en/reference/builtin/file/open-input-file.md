---
title: open-input-file
---

# Type

```scheme
(-> string-t file-t)
```

# Description

Open file for reading. Takes a file path, returns a file handle.

# Examples

```scheme
(= file (open-input-file "data.txt"))
```
