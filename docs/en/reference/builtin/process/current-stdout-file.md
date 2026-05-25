---
title: current-stdout-file
---

# Type

```scheme
(-> file-t)
```

# Description

Get the current standard output file handle.

# Examples

```scheme
(file-write "hello" (current-stdout-file))
(file-writeln "done" (current-stdout-file))
```
