---
title: string-chars
---

# Type

```scheme
(-> string-t (list-t string-t))
```

# Description

Split a string into a list of single-character strings.

# Examples

```scheme
(string-chars "abc")   ;; => ["a" "b" "c"]
(string-chars "")      ;; => []
(string-chars "你好")  ;; => ["你" "好"]
```
