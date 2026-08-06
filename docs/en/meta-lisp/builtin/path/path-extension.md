---
title: path-extension
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Get the file extension (including the dot).

# Examples

```meta-lisp
(path-extension "/tmp/foo.txt")  ;; => ".txt"
(path-extension "/tmp/foo")      ;; => ""
```
