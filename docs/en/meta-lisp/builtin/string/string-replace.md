---
title: string-replace
---

# Type

```meta-lisp
(-> string-t string-t string-t string-t)
```

# Description

Replace all occurrences of `old` with `new` in a string.

# Examples

```meta-lisp
(string-replace "hello world" "world" "there")  ;; => "hello there"
(string-replace "aaa" "a" "b")                  ;; => "bbb"
(string-replace "abc" "x" "y")                  ;; => "abc"
```
