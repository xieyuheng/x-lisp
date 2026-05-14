---
title: file-write
---

# Type

```scheme
(-> file-t string-t void-t)
```

# Description

Write a string to a file.

# Examples

```scheme
(= file (open-output-file "output.txt"))
(file-write file "hello world")
(file-close file)
```
