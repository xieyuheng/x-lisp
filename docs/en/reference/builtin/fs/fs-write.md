---
title: fs-write
---

# Type

```scheme
(-> string-t string-t void-t)
```

# Description

Write a string to a file. Creates the file if it doesn't exist, overwrites if it does.

# Examples

```scheme
(fs-write "/tmp/foo.txt" "hello world")
```
