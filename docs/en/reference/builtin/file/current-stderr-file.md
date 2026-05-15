---
title: current-stderr-file
---

# Type

```scheme
(-> file-t)
```

# Description

Get the current standard error file handle.

# Examples

```scheme
(file-writeln "error: something went wrong" (current-stderr-file))
```
