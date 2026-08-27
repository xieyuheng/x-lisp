---
title: text-concat
---

# Type

```meta-lisp
(-> (list-t text-t) text-t)
```

# Description

Concatenate a list of strings, equivalent to applying `text-append` sequentially.

# Examples

```meta-lisp
(text-concat ["a" "b" "c"])  ;; => "abc"
(text-concat [])             ;; => ""
(text-concat ["hello " "world"])  ;; => "hello world"
```
