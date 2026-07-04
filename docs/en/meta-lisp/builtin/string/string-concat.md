---
title: string-concat
---

# Type

```meta-lisp
(-> (list-t string-t) string-t)
```

# Description

Concatenate a list of strings, equivalent to applying `string-append` sequentially.

# Examples

```meta-lisp
(string-concat ["a" "b" "c"])  ;; => "abc"
(string-concat [])             ;; => ""
(string-concat ["hello " "world"])  ;; => "hello world"
```
