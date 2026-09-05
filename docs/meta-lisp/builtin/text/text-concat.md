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
(text-concat (@list "a" "b" "c"))  ;; => "abc"
(text-concat (@list))             ;; => ""
(text-concat (@list "hello " "world"))  ;; => "hello world"
```
