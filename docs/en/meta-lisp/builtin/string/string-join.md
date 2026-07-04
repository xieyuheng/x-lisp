---
title: string-join
---

# Type

```meta-lisp
(-> string-t (list-t string-t) string-t)
```

# Description

Join a list of strings with a delimiter, the inverse of `string-split`.

# Examples

```meta-lisp
(string-join "," ["a" "b" "c"])  ;; => "a,b,c"
(string-join " " ["a" "b"])      ;; => "a b"
(string-join "" ["a" "b"])       ;; => "ab"
```
