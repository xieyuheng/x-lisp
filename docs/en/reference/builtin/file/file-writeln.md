---
title: file-writeln
---

# Type

```scheme
(-> file-t string-t void-t)
```

# Description

Write a string to a file followed by a newline.

# Examples

```scheme
(= file (open-output-file "output.txt"))
(file-writeln file "hello")
(file-writeln file "world")
(file-close file)
```
