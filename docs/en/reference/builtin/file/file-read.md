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
(= file (open-input-file "data.txt"))
(= content (file-read file))
(file-close file)
```
