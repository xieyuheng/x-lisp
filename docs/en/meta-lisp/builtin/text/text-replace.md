---
title: text-replace
---

# Type

```meta-lisp
(-> text-t text-t text-t text-t)
```

# Description

Replace all occurrences of `old` with `new` in a text.

# Examples

```meta-lisp
(text-replace "hello world" "world" "there")  ;; => "hello there"
(text-replace "aaa" "a" "b")                  ;; => "bbb"
(text-replace "abc" "x" "y")                  ;; => "abc"
```
