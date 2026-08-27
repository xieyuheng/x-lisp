---
title: current-stderr-file
---

# Type

```meta-lisp
(-> file-t)
```

# Description

Get the current standard error file handle.

# Examples

```meta-lisp
(file-writeln "error: something went wrong" (current-stderr-file))
```
