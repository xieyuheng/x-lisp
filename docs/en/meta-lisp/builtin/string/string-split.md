---
title: string-split
---

# Type

```meta-lisp
(-> string-t string-t (list-t string-t))
```

# Description

Split a string into a list by a delimiter.

# Examples

```meta-lisp
(string-split "a,b,c" ",")     ;; => ["a" "b" "c"]
(string-split "hello" ",")     ;; => ["hello"]
(string-split "" ",")          ;; => [""]
```
