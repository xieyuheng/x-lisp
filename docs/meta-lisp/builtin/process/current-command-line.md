---
title: current-command-line
---

# Type

```meta-lisp
(-> (list-t text-t))
```

# Description

Get the command line arguments after the `--` separator.

When the xvm executable is invoked with `--`, all arguments after `--` are collected
as the current command line. For example:

```
xvm run program.x86.exe -- check --verbose
```

`(current-command-line)` returns `["check" "--verbose"]`.

# Examples

```meta-lisp
(current-command-line)  ;; => ["check" "--verbose"]
```
