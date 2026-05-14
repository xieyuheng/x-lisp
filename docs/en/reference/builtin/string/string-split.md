---
title: string-split
---

# Type

```scheme
(-> string-t string-t (list-t string-t))
```

# Description

Split a string into a list by a delimiter.

# Examples

```scheme
(string-split "a,b,c" ",")     ;; => ["a" "b" "c"]
(string-split "hello" ",")     ;; => ["hello"]
(string-split "" ",")          ;; => [""]
```
