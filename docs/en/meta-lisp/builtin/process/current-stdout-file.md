---
title: current-stdout-file
---

# Type

```meta-lisp
(-> file-t)
```

# Description

Get the current standard output file handle.

# Examples

```meta-lisp
(file-write "hello" (current-stdout-file))
(file-writeln "done" (current-stdout-file))
```
