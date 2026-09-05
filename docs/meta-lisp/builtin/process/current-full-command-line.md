---
title: current-full-command-line
---

# Type

```meta-lisp
(-> (list-t text-t))
```

# Description

Get the full command line arguments as passed to the xvm2 executable (including
the executable name and subcommand).

For example, given the invocation:

```
xvm2 run program.x86.exe -- check --profile
```

`(current-full-command-line)` returns
`["xvm2" "run" "program.x86.exe" "--" "check" "--profile"]`.

# Examples

```meta-lisp
(current-full-command-line)
;; => ["xvm2" "run" "program.x86.exe" "--" "check" "--profile"]
```
