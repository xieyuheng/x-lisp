---
title: path-relative
---

# Type

```scheme
(-> string-t string-t string-t)
```

# Description

Returns the relative path from `from` to `to`.

Note: `from` and `to` must both be absolute paths or both be relative paths. Mixing is not allowed.

# Examples

Absolute paths:

```scheme
(path-relative "/a/b/c" "/a/b/d/e")    ;; => "../d/e"
(path-relative "/a/b/c" "/a/b/c/d")    ;; => "d"
(path-relative "/app/config" "/app")   ;; => ".."
```

Relative paths:

```scheme
(path-relative "a/b/c" "a/b/d/e")      ;; => "../d/e"
(path-relative "a/b/c" "a/b/c/d")      ;; => "d"
(path-relative "." "src")              ;; => "src"
```
