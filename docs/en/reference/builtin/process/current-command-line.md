---
title: current-command-line
---

# Type

```scheme
(-> (list-t string-t))
```

# Description

Get the command line arguments after the `--` separator.

When the xvm executable is invoked with `--`, all arguments after `--` are collected
as the current command line. For example:

```
xvm run program.xexe -- check --profile
```

`(current-command-line)` returns `["check" "--profile"]`.

# Examples

```scheme
(current-command-line)  ;; => ["check" "--profile"]
```
