---
title: open-output-file
---

# Type

```scheme
(-> string-t file-t)
```

# Description

Open file for writing. Takes a file path, returns a file handle. Creates the file if it doesn't exist, overwrites if it does.

# Examples

```scheme
(= file (open-output-file "output.txt"))
```
