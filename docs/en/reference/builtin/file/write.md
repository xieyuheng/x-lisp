---
title: write
---

# Type

```scheme
(-> string-t void-t)
```

# Description

Write a string to standard output (no quotes, no newline).

# Examples

```scheme
(write "hello ")
(writeln "world")
;; outputs: hello world\n
```
