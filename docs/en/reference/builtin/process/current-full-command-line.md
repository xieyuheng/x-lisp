---
title: current-full-command-line
---

# Type

```scheme
(-> (list-t string-t))
```

# Description

Get the full command line arguments as passed to the xvm executable (including
the executable name and subcommand).

For example, given the invocation:

```
xvm run program.xexe -- check --profile
```

`(current-full-command-line)` returns
`("xvm" "run" "program.xexe" "--" "check" "--profile")`.

# Examples

```scheme
(current-full-command-line)
;; => ("xvm" "run" "program.xexe" "--" "check" "--profile")
```
