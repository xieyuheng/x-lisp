---
title: fs-list
---

# Type

```scheme
(-> string-t (list-t string-t))
```

# Description

List directory contents.

# Examples

```scheme
(fs-list "/tmp")  ;; => ["a.txt" "b.txt" "subdir"]
```
