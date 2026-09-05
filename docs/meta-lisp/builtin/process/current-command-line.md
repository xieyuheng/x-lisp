---
title: current-command-line
---

# Type

```meta-lisp
(-> (list-t text-t))
```

# Description

Get the command line arguments after the `--` separator.

When the xvm2 executable is invoked with `--`, all arguments after `--` are collected
as the current command line. For example:

```
xvm2 run program.x86.exe -- check --profile
```

`(current-command-line)` returns `["check" "--profile"]`.

# Examples

```meta-lisp
(current-command-line)  ;; => ["check" "--profile"]
```
