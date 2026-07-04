---
title: path-extension
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Get the file extension (including the dot).

# Examples

```meta-lisp
(path-extension "/tmp/foo.txt")  ;; => ".txt"
(path-extension "/tmp/foo")      ;; => ""
```
