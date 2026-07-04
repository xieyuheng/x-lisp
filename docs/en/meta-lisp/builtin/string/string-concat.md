---
title: string-concat
---

# Type

```scheme
(-> (list-t string-t) string-t)
```

# Description

Concatenate a list of strings, equivalent to applying `string-append` sequentially.

# Examples

```scheme
(string-concat ["a" "b" "c"])  ;; => "abc"
(string-concat [])             ;; => ""
(string-concat ["hello " "world"])  ;; => "hello world"
```
