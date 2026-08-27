---
title: text-split
---

# Type

```meta-lisp
(-> text-t text-t (list-t text-t))
```

# Description

Split a text into a list by a delimiter.

# Examples

```meta-lisp
(text-split "a,b,c" ",")     ;; => ["a" "b" "c"]
(text-split "hello" ",")     ;; => ["hello"]
(text-split "" ",")          ;; => [""]
```
