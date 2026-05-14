---
title: path-extension
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Get the file extension (including the dot).

# Examples

```scheme
(path-extension "/tmp/foo.txt")  ;; => ".txt"
(path-extension "/tmp/foo")      ;; => ""
```
