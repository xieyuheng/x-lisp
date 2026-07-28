---
title: path-write
---

# Type

```meta-lisp
(-> string-t string-t void-t)
```

# Description

Write a string to a file. Creates the file if it doesn't exist, overwrites if it does.

# Examples

```meta-lisp
(path-write "/tmp/foo.txt" "hello world")
```
