---
title: path-relative-to-cwd
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Returns `path` relative to the current working directory (cwd).

Note: cwd is always absolute, so `path` must be absolute as well.
Passing a relative path will trigger an assertion error.

# Examples

```scheme
(path-relative-to-cwd "/home/user/project/src")  ;; e.g. => "src"
(path-relative-to-cwd "/home/user")               ;; e.g. => ".."
```
