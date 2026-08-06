---
title: path-write
---

# Type

```meta-lisp
(-> text-t text-t void-t)
```

# Description

Write a text to a file. Creates the file if it doesn't exist, overwrites if it does.

# Examples

```meta-lisp
(path-write "/tmp/foo.txt" "hello world")
```
