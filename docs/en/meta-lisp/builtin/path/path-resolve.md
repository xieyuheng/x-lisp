---
title: path-resolve
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Resolves a path to an absolute path. If `path` is already absolute (starts with `/`), returns it as-is; otherwise, joins it with the current working directory and normalizes.

# Examples

```meta-lisp
(path-resolve "/etc")   ;; => "/etc"
(path-resolve "foo")    ;; => "/home/user/foo"
(path-resolve "./bar")  ;; => "/home/user/bar"
```
